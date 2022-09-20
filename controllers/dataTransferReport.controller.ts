import { NextFunction, Request, Response } from 'express';
import { fetchSignedResolution } from '../common/common';
import { VerificationResolutionPayload } from '@i3m/non-repudiation-library';
import { openDb } from '../sqlite/sqlite';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';


export async function nrpCompletenessCheck(req: Request, res: Response, next: NextFunction) {

    try {
        const verificationRequest = req.body.verificationRequest
        const signedResolution = await fetchSignedResolution(verificationRequest)

        const { payload, signer } = await nonRepudiationLibrary.ConflictResolution.verifyResolution<VerificationResolutionPayload>(signedResolution)

        if (payload.resolution === 'completed') {
            // is a valid proof of completeness signed by signer (the public JWK)
            console.log("NRP Protocol is completed")
        }

        res.send({ resolution: payload.resolution })
    } catch (error) {
        next(error)
    }
}

export async function getListOfVerificationRequests(req: Request, res: Response, next: NextFunction) {

    try {
        const agreementId = req.params.agreementId

        const select = 'SELECT VerificationRequest FROM Accounting WHERE AgreementId=?'
        const selectParams = [agreementId]

        const db = await openDb()
        const selectResult = await db.all(select, selectParams)

        await db.close()

        res.send(selectResult)
    } catch (error) {
        next(error)
    }
}

export async function accountDataBlock(req: Request, res: Response, next: NextFunction) {

    try {

        const exchangeId = req.params.exchangeId

        const db = await openDb()

        const select = 'SELECT * FROM Accounting WHERE ExchangeId=?'
        const params = [exchangeId]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            res.send(selectResult)
        } else {
            res.send({ msg: `No transfer with exchange id ${exchangeId} found` })
        }


    } catch (error) {
        next(error)
    }
}

export async function getSubId(req: Request, res: Response, next: NextFunction) {

    try {

        const consumerDid = req.params.consumerDid
        const dataSourceUid = req.params.dataSourceUid
        const db = await openDb()

        const select = 'SELECT SubId FROM StreamSubscribers WHERE ConsumerDid=? AND DataSourceUid=?'
        const params = [consumerDid, dataSourceUid]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            res.send(selectResult)
        } else {
            res.send({ msg: `User ${consumerDid} is not subscribed` })
        }

    } catch (error) {
        next(error)
    }
}

export async function streamingAccountReport(req: Request, res: Response, next: NextFunction) {

    try {

        const subId = req.params.subId
        const db = await openDb()

        const select = 'SELECT * FROM StreamSubscribers WHERE SubId=?'
        const params = [subId]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            res.send(selectResult)
        } else {
            res.send({ msg: `No subscriber with subId ${subId} found` })
        }

    } catch (error) {
        next(error)
    }
}

export async function getAccountSummary(req: Request, res: Response, next: NextFunction) {

    try {

        const consumerDid = req.params.consumerDid
        const mode = 'batch'

        const db = await openDb()

        const selectBatch = 'SELECT * FROM Accounting WHERE ConsumerId=? AND Mode=?'
        const batchParams = [consumerDid, mode]

        const selectStream = 'SELECT AmmountOfDataReceived FROM StreamSubscribers WHERE ConsumerDid=?'
        const streamParams = [consumerDid]

        const selectBatchtResult = await db.all(selectBatch, batchParams)
        const selectStreamResult = await db.get(selectStream, streamParams)

        const nrOfBlocksReceived = selectBatchtResult.length + 1

        await db.close()
        
        if (selectStreamResult !== undefined) {
            res.send({ Batch: { nrOfBlocksReceived: nrOfBlocksReceived }, Stream: { ammountOfDataReceived: selectStreamResult.AmmountOfDataReceived } })
        } else {
            res.send({ Batch: { nrOfBlocksReceived: nrOfBlocksReceived }, Stream: { ammountOfDataReceived: 0 } })
        }

    } catch (error) {
        next(error)
    }
}