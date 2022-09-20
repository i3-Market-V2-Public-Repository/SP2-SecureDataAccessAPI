import { NextFunction, Request, Response } from 'express';
import { DataExchangeAgreement, JWK } from '@i3m/non-repudiation-library';
import { openDb } from '../sqlite/sqlite';
import { retrieveRawPaymentTransaction, retrievePrice } from '../common/common';
import { PaymentBody } from '../types/openapi';

//generate new keys
const privateJwk: JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: '342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
    y: 'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
    d: 'bF0ufFC_AHEY98HIZnqLdIMp1Hnh-8Y2sglQ15GOp7k',
    alg: 'ES256'
}

const publicJwk: JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: '342tToZrvj64K-0vPuq9B5t8Bx3kjOlVW574Q2vo-zY',
    y: 'KtukEk-5ZSvJznoWYl99l6x8CbxbMDYJ7fBbwU8Dnpk',
    alg: 'ES256'
}

export async function getDaaPublicKey(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to retrieve the public key of the provider.'

        /* 
        #swagger.requestBody = {
               required: true,
               content : {
                   "application/json": {
                        schema: { $ref: "#/components/schemas/providerPublicKeyReq" }
                    }
                }
        } 
        */

        const dataExchangeAgreement: DataExchangeAgreement = req.body
        const consumerPublicKey = dataExchangeAgreement.orig

        dataExchangeAgreement.orig = JSON.stringify(dataExchangeAgreement.orig)
        dataExchangeAgreement.dest = JSON.stringify(publicJwk)

        const db = await openDb()

        const insert = 'INSERT INTO DataExchangeAgreements(ConsumerPublicKey, ProviderPublicKey, ProviderPrivateKey, DataExchangeAgreement) VALUES (?, ?, ?, ?)'
        const select = 'SELECT * FROM DataExchangeAgreements WHERE DataExchangeAgreement=?'

        const insertParams = [JSON.stringify(consumerPublicKey), JSON.stringify(publicJwk), JSON.stringify(privateJwk), JSON.stringify(dataExchangeAgreement)]
        const selectParams = [JSON.stringify(dataExchangeAgreement)]

        const selectResult = await db.all(select, selectParams, db)

        if (selectResult.length === 0) {
            await db.run(insert, insertParams)
        }

        await db.close()

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/components/schemas/publicKey" }
            } */
            
        res.send(publicJwk)

    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}

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
    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}

export async function getDataExchangeAgreement(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to retrieve the data exchange agreement.'

        /* 
        #swagger.requestBody = {
               required: true,
               content : {
                   "application/json": {
                        schema: { $ref: "#/components/schemas/dataExchangeAgreementReq" }
                    }
                }
        } 
        */
        const consumerPublicKey: JWK = req.body.consumerPublicKey
        const providerPublicKey: JWK = req.body.providerPublicKey

        const db = await openDb()

        const select = 'SELECT DataExchangeAgreement FROM DataExchangeAgreements WHERE ConsumerPublicKey=? AND ProviderPublicKey=?'
        const params = [JSON.stringify(consumerPublicKey), JSON.stringify(providerPublicKey)]

        const selectResult: string | undefined = await db.get(select, params)

        if (selectResult != undefined) {
            res.send(selectResult)
        } else {
            // #swagger.responses[404]
            res.send({ msg: `No data exchange agreement found for the respective public keys` })
        }
    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}