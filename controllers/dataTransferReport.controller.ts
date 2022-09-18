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

        res.send({resolution: payload.resolution})
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

        res.send(selectResult)

    } catch (error) {
        next(error)
    }
}