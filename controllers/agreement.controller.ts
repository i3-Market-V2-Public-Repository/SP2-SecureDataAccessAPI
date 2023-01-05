import { NextFunction, Request, Response } from 'express';
import { openDb } from '../sqlite/sqlite';
import { retrieveRawPaymentTransaction, retrievePrice, getAgreement, deployRawPaymentTx } from '../common/common';
import { PaymentBody, Prerequisite, SerializedTxObj } from '../types/openapi';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import providerOperatorWallet from '../config/providerOperatorWallet'
import { WalletComponents } from '@i3m/wallet-desktop-openapi/types'
import { parseJwk } from '@i3m/non-repudiation-library';

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
        const agreementId = Number(req.params.agreementId)
        const payment: PaymentBody = req.body

        const agreement = await getAgreement(agreementId)

        if (agreement.pricingModel.fee === 0) {
            const error = {
                // #swagger.responses[200]
                status: 200,
                path: 'agreement.controller.poo',
                name: 'OK',
                message: `You dont have to pay for agreement ${agreementId}. The fee is 0.`
            }
            throw new HttpError(error)
        }

        const db = await openDb()
        
        const selectProviderInsertedInfo = 'SELECT * FROM DataExchangeAgreements WHERE AgreementId=?'

        const selectParamsProviderInsertedInfo  = [agreementId]

        const selectResultProviderInsertedInfo  = await db.all(selectProviderInsertedInfo, selectParamsProviderInsertedInfo)

        if (selectResultProviderInsertedInfo.length === 0) {
            const error = {
                // #swagger.responses[404]
                status: 404,
                path: 'agreement.controller.poo',
                name: 'Not Found',
                message: `Provider didn't post any info about agreement ${agreementId}`
            }
            throw new HttpError(error)
        }

        const select = 'SELECT Payment FROM MarketFeePayments WHERE AgreementId = ?'
        const selectParams = [agreementId]

        const selectResult = await db.get(select, selectParams)

        await db.close()

        if (selectResult) {
            const error = {
                status: 200,
                path: 'agreement.controller.poo',
                name: 'Ok',
                message: `Market fee already payed for agreement ${agreementId}`
            }
            throw new HttpError(error)
        }
        
        const amount = agreement.pricingModel.fee

        payment.feeAmount = amount

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

export async function deployRawPaymentTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        
        // #swagger.tags = ['AgreementController']
        // #swagger.description = 'Endpoint to deploy transaction object market fee.'

        /* 
        #swagger.requestBody = {
               required: true,
               content : {
                   "application/json": {
                        schema: { $ref: "#/components/schemas/feeTxReq" }
                    }
                }
        } 
        */

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)
        const consumerDid = decoded.sub

        const agreementId = req.params.agreementId
        const serializedTxObj: SerializedTxObj = req.body

        const transactionObj = await deployRawPaymentTx(serializedTxObj)
        //aici
        if (transactionObj.transactionObject.status === true) {

            const payment = 'true'

            const db = await openDb()

            const insert = 'INSERT INTO MarketFeePayments(AgreementId, ConsumerDid, Payment) VALUES (?, ?, ?)'
            const insertParams = [agreementId, consumerDid, payment]

            await db.run(insert, insertParams)

            await db.close()

            /* #swagger.responses[200] = { 
               schema: { $ref: "#/components/schemas/feeTxRes" }
             } */

            res.send({ msg: 'Market fee payed' })
        } else {
            res.status(500).send(transactionObj)
        }
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
        const dataSharingAgreement = info.dataSharingAgreement as WalletComponents.Schemas.DataSharingAgreement

        console.log(info.dataSharingAgreement)

        const providerWallet = providerOperatorWallet.getProviderOperatorWallet()

        await providerWallet!.resourceCreate({
            type: 'Contract',
            resource: {
              dataSharingAgreement,
              keyPair: {
                publicJwk: await parseJwk(JSON.parse(JSON.stringify(info.providerPublicKey)), true),
                privateJwk: await parseJwk(JSON.parse(JSON.stringify(info.providerPrivateKey)), true)
              }
            }
          })

        const db = await openDb()
        
        const insert = 'INSERT INTO DataExchangeAgreements(AgreementId, ConsumerPublicKey, ProviderPublicKey, ProviderPrivateKey, DataSharingAgreement, DataExchangeAgreement) VALUES (?, ?, ?, ?, ?, ?)'
        const select = 'SELECT * FROM DataExchangeAgreements WHERE AgreementId=?'
        const update = 'UPDATE DataExchangeAgreements SET ConsumerPublicKey=?, ProviderPublicKey=?, ProviderPrivateKey=?, DataSharingAgreement=?, DataExchangeAgreement=? WHERE AgreementId=?'

        const insertParams = [info.agreementId, JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement.dest), JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement.orig), 
                             JSON.stringify(info.providerPrivateKey), JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement)]
        const selectParams = [info.agreementId]
        const updateParams = [JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement.dest), JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement.orig), 
                            JSON.stringify(info.providerPrivateKey), JSON.stringify(info.dataSharingAgreement), JSON.stringify(info.dataSharingAgreement.dataExchangeAgreement), info.agreementId]

        const selectResult = await db.all(select, selectParams)

        if (selectResult.length === 0) {
            await db.run(insert, insertParams)
            // #swagger.responses[200]
            res.send({msg: 'Agreement info inserted'})
        } else {
            // #swagger.responses[200]
            await db.run(update, updateParams)
            res.send({msg: `Info for agreement ${info.agreementId} updated`})
        }
        await db.close()

    } catch (error) {
        next(error) // #swagger.responses[500]
    }
}