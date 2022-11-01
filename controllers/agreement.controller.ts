import { NextFunction, Request, Response } from 'express';
import { openDb } from '../sqlite/sqlite';
import { retrieveRawPaymentTransaction, retrievePrice } from '../common/common';
import { PaymentBody, Prerequisite } from '../types/openapi';

export async function payMarketFee(req: Request, res: Response, next: NextFunction) {

    try {
        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to pay the market fee.'

        /* 
        #swagger.requestBody = {
               required: true,
               content : {
                   "application/json": {
                        schema: { $ref: "#/components/schemas/payMarketFeeReq" }
                    }
                }
        } 
        */
        const offeringId = req.params.offeringId
        const payment: PaymentBody = req.body

        const amount = await retrievePrice(offeringId)
        payment.amount = String(amount)

        console.log(payment)
        const rawPaymentTransaction = await retrieveRawPaymentTransaction(payment)
        
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/components/schemas/transactionObject" }
        } */

        res.send(rawPaymentTransaction)
    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}

export async function getAgreementId(req: Request, res: Response, next: NextFunction) {

    try {
        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to retrieve the agreement id.'

        const exchangeId = req.params.exchangeId

        const db = await openDb()

        const select = 'SELECT AgreementId FROM Accounting WHERE ExchangeId=?'
        const params = [exchangeId]

        const selectResult = await db.get(select, params)

        if (selectResult != undefined) {

            /* #swagger.responses[200] = { 
               schema: { $ref: "#/components/schemas/agreementId" }
            } */

            res.send(selectResult)
        } else {
            // #swagger.responses[404]
            res.status(404).send({ msg: `No agreement found for exchangeId ${exchangeId}` })
        }

        await db.close()

    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}

export async function getDataExchangeAgreement(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to retrieve the data exchange agreement.'

        const agreementId = req.params.agreementId
        const db = await openDb()

        const select = 'SELECT DataExchangeAgreement FROM DataExchangeAgreements WHERE AgreementId=?'
        const params = [agreementId]

        const selectResult = await db.get(select, params)

        if (selectResult != undefined) {
            /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/dataExchangeAgreementRes" }} */
            res.send(JSON.parse(selectResult.DataExchangeAgreement))
        } else {
            // #swagger.responses[404]
            res.send({ msg: `No data exchange agreement found for agreementId ${agreementId}` })
        }

        await db.close()

    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}

export async function prerequisiteInfo(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint for info about the data exchange agreement to be inserted by the provider.'

        /* 
        #swagger.requestBody = {
               required: true,
               content : {
                   "application/json": {
                        schema: { $ref: "#/components/schemas/prerequisiteInfo" }
                    }
                }
        } 
        */

        const info:Prerequisite = req.body

        const db = await openDb()
        
        const insert = 'INSERT INTO DataExchangeAgreements(AgreementId, ConsumerPublicKey, ProviderPublicKey, ProviderPrivateKey, DataExchangeAgreement) VALUES (?, ?, ?, ?, ?)'
        const select = 'SELECT * FROM DataExchangeAgreements WHERE AgreementId=?'

        const insertParams = [info.agreementId, JSON.stringify(info.dataExchangeAgreement.dest), JSON.stringify(info.dataExchangeAgreement.orig), 
                             JSON.stringify(info.providerPrivateKey), JSON.stringify(info.dataExchangeAgreement)]
        const selectParams = [info.agreementId]

        const selectResult = await db.all(select, selectParams)

        if (selectResult.length === 0) {
            await db.run(insert, insertParams)
            // #swagger.responses[200]
            res.send({msg: 'Agreement info inserted'})
        } else {
            // #swagger.responses[200]
            res.send({msg: `Info for agreement ${info.agreementId} already inserted`})
        }

        await db.close()

    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}