import { NextFunction, Request, Response } from 'express';
import { fetchSignedResolution } from '../common/common';
import { VerificationResolutionPayload } from '@i3m/non-repudiation-library';
import { openDb } from '../sqlite/sqlite';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';


export async function nrpCompletenessCheck(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to check if the non-repudiable protocol was completed for a block of data.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/verificationReq" }
                        }
                    }
        } 
        */

        const verificationRequest = req.body.verificationRequest
        const signedResolution = await fetchSignedResolution(verificationRequest)

        const { payload, signer } = await nonRepudiationLibrary.ConflictResolution.verifyResolution<VerificationResolutionPayload>(signedResolution)

        if (payload.resolution === 'completed') {
            // is a valid proof of completeness signed by signer (the public JWK)
            console.log("NRP Protocol is completed")
        }

        /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/verificationRes" }} */
        res.send({ signedResolution: signedResolution })
    } catch (error) {
        next(error)
    }
}

export async function getListOfVerificationRequests(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to get all the verification requests for an agreement.'

        const agreementId = req.params.agreementId

        const select = 'SELECT VerificationRequest FROM Accounting WHERE AgreementId=?'
        const selectParams = [agreementId]

        const db = await openDb()
        const selectResult = await db.all(select, selectParams)

        await db.close()

        /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/listOfVerificationRequestsRes" }} */
        res.send(selectResult)
    } catch (error) {
        next(error)
    }
}

export async function accountDataBlock(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to get information about a transfered data block.'

        const exchangeId = req.params.exchangeId

        const db = await openDb()

        const select = 'SELECT * FROM Accounting WHERE ExchangeId=?'
        const params = [exchangeId]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/accountDataBlockRes" }} */
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

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to get the subscription id.'

        const consumerDid = req.params.consumerDid
        const dataSourceUid = req.params.dataSourceUid
        const db = await openDb()

        const select = 'SELECT SubId FROM StreamSubscribers WHERE ConsumerDid=? AND DataSourceUid=?'
        const params = [consumerDid, dataSourceUid]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/getSubIdRes" }} */
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

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to get information about a subscription.'

        const subId = req.params.subId
        const db = await openDb()

        const select = 'SELECT * FROM StreamSubscribers WHERE SubId=?'
        const params = [subId]

        const selectResult = await db.get(select, params)

        await db.close()

        if (selectResult !== undefined) {
            /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/streamingAccountReportRes" }} */
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

        // #swagger.tags = ['DataTransferReportController']
        // #swagger.description = 'Endpoint to get information about ammount of data transfered for a consumer.'

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
            /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/getAccountSummaryRes" }} */
            res.send({ Batch: { nrOfBlocksReceived: nrOfBlocksReceived }, Stream: { ammountOfDataReceivedInBytes: selectStreamResult.AmmountOfDataReceived } })
        } else {
            res.send({ Batch: { nrOfBlocksReceived: nrOfBlocksReceived }, Stream: { ammountOfDataReceivedInBytes: 0 } })
        }

    } catch (error) {
        next(error)
    }
}