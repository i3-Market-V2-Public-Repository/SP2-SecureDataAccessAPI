import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { BatchRequest, BatchDaaResponse, Mode, ConnectorResponse } from '../types/openapi';
import { getTimestamp, getAgreement, getAgreementState, getDataBlock, listFiles } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import jwtDecode, { JwtPayload } from "jwt-decode";
import npsession from '../session/np.session';
import providerWallet from '../config/providerOperatorWallet';
import { JWK, parseJwk } from '@i3m/non-repudiation-library';
import { stringify } from 'ts-jest';

const BJSON = require('buffer-json')

async function poo(req: Request, res: Response, next: NextFunction) {
    try {

        // #swagger.tags = ['BatchController']
        // #swagger.description = 'Endpoint to retrieve batch data.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/batchReq" }
                        }
                    }
        } 
        */

        const mode = 'batch'

        const batchReqParams: BatchRequest = res.locals.reqParams.input
        //const agreement: Agreement = await getAgreement(batchReqParams.agreementId)

        const agreementId = batchReqParams.agreementId
        const blockId = batchReqParams.blockId
        const blockAck = batchReqParams.blockAck
        const data = batchReqParams.data

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)

        let session: Mode = npsession.get(decoded.sub!)

        if (session === undefined || session.batch?.agreementId !== agreementId) {
            const agreement = await getAgreement(agreementId)
            if (agreement.dataStream === true) {
                const error = {
                    // #swagger.responses[500]
                    status: 500,
                    path: 'batch.controller.poo',
                    name: 'Internal Server Error',
                    message: `Agreement with agreementId ${agreementId} has field dataStream as true. For batch transfer it is expected to be false.`
                }
                throw new HttpError(error)
            }
            session = {
                batch: {
                    agreementId: agreementId,
                    agreement: agreement,
                    payment: false
                }
            }
        }

        const db = await openDb()

        if (session.batch?.agreement.pricingModel.fee! > 0) {
            const selectPayment = 'SELECT Payment, ConsumerDid FROM MarketFeePayments WHERE AgreementId=?'
            const selectPaymentParams = [agreementId]

            const selectPaymentResult = await db.get(selectPayment, selectPaymentParams)

            if(!selectPaymentResult) {
                const error = {
                    // #swagger.responses[404]
                    status: 404,
                    path: 'batch.controller.poo',
                    name: 'Not Found',
                    message: `Consumer with did ${decoded.sub} didn't pay for agreementId ${agreementId}.`
                }
                throw new HttpError(error)
            } else if (selectPaymentResult.ConsumerDid !== decoded.sub) {
                const error = {
                    // #swagger.responses[404]
                    status: 403,
                    path: 'batch.controller.poo',
                    name: 'Forbidden',
                    message: `Consumer with did ${decoded.sub} didn't pay for agreementId ${agreementId}. Please authenticate with the right consumer account!`
                }
                throw new HttpError(error)
            }
        } else {
            session.batch!.payment = true
        }

        const select = 'SELECT DataExchangeAgreement, ProviderPrivateKey, ConsumerPublicKey FROM DataExchangeAgreements WHERE AgreementId = ?'
        const params = [agreementId]


        const selectResult = await db.get(select, params)
        
        if (!selectResult) {
            const error = {
                // #swagger.responses[404]
                status: 404,
                path: 'batch.controller.poo',
                name: 'Not found',
                message: `Cant find dataExchangeAgreement for agreementId ${agreementId}.`
            }
            throw new HttpError(error)
        } 

        const agreementState = await getAgreementState(agreementId)

        if (agreementState?.state !== 'active') {
            if (agreementState.state === 'violated' || agreementState.state === 'terminated' ){
                res.status(410).send({msg:`The agreement with agreementId ${agreementId} is in state ${agreementState.state}`})
            } else {
                const error = {
                    // #swagger.responses[404]
                    status: 500,
                    path: 'batch.controller.poo',
                    name: 'Internal server error',
                    message: JSON.stringify(agreementState)
                }
                throw new HttpError(error)
            }
        }

        const providerOperatorWallet = providerWallet.getProviderOperatorWallet()
        const providerDid = providerWallet.getProviderDid()

        const providerDltAgent = new nonRepudiationLibrary.I3mServerWalletAgentOrig(providerOperatorWallet!, providerDid!)

        const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = JSON.parse(selectResult.DataExchangeAgreement)

        dataExchangeAgreement.orig = await parseJwk(JSON.parse(dataExchangeAgreement.orig), true)
        dataExchangeAgreement.dest = await parseJwk(JSON.parse(dataExchangeAgreement.dest), true)

        const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(selectResult.ProviderPrivateKey)

        const offeringId = session.batch?.agreement.dataOffering.dataOfferingId

        const selectUrl = 'SELECT Url FROM DataSources WHERE OfferingId = ?'
        const selectParams = [offeringId]

        const selectResults = await db.get(selectUrl, selectParams)
        
        if (!selectResults) {
            const error = {
                // #swagger.responses[404]
                status: 404,
                path: 'batch.controller.poo',
                name: 'Not found',
                message: `Cant find data source url for offeringId ${offeringId}.`
            }
            throw new HttpError(error)
        } 

        await db.close()

        const dataSourceUrl = selectResults.Url

        if (blockId === 'null' && blockAck === 'null') {

            const getBlock = await getDataBlock(dataSourceUrl, data, blockId)
            const nextBlockId = getBlock.nextBlockId

            const batchDaaResponse: BatchDaaResponse = { blockId: "null", nextBlockId: nextBlockId, poo: "null", cipherBlock: "null" }

            console.log(`Daa response is ${batchDaaResponse}`)

            /* #swagger.responses[200 - First Block Response] = { schema: { $ref: "#/components/schemas/batchFirstBlockRes" }} */
            res.send(batchDaaResponse)

        } else if ((blockId != 'null' && blockAck == 'null') || (blockId != 'null' && blockAck != 'null')) {
            
            const getBlock = await getDataBlock(dataSourceUrl, data, blockId)
            
            const nextBlockId = getBlock.nextBlockId
            const responseToString = BJSON.stringify(getBlock)
            const responseToBuffer: ConnectorResponse = BJSON.parse(responseToString)
            const rawBufferData = responseToBuffer.data

            const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, providerDltAgent)

            const poo = await npProvider.generatePoO()

            await providerOperatorWallet!.resourceCreate({
                type: 'NonRepudiationProof',
                resource: poo.jws
            })

            const cipherBlock = npProvider.block.jwe

            const batchDaaResponse: BatchDaaResponse = { blockId: blockId, nextBlockId: nextBlockId, poo: poo.jws, cipherBlock: cipherBlock }

            const agreement = session.batch!.agreement
            const payment = session.batch!.payment

            npsession.set(decoded.sub!, agreementId, npProvider, agreement, payment, mode)

            /* #swagger.responses[200 - Block Response] = { schema: { $ref: "#/components/schemas/batchRes" }} */
            res.send(batchDaaResponse)

        } else if (blockId == 'null' && blockAck != 'null') {

            const batchDaaResponse: BatchDaaResponse = { blockId: "null", nextBlockId: "null", poo: "null", cipherBlock: "null" }

            /* #swagger.responses[200 - Last Block Response] = { schema: { $ref: "#/components/schemas/batchLastBlockRes" }} */
            res.send(batchDaaResponse);
        }
    } catch (error) {
        next(error)
    }
}

async function pop(req: Request, res: Response, next: NextFunction) {
    try {

        // #swagger.tags = ['BatchController']
        // #swagger.description = 'Endpoint to retrieve the proof of publication.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/popReq" }
                        }
                    }
        } 
        */

        const mode = 'batch'

        const providerOperatorWallet = providerWallet.getProviderOperatorWallet()

        const por: string = req.body.por

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)

        const session: Mode = npsession.get(decoded.sub!)

        const agreement = session.batch!.agreement
        const payment = session.batch!.payment

        const npProvider: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig = session.batch!.npProvider!
        await npProvider.verifyPoR(por)

        await providerOperatorWallet!.resourceCreate({
            type: 'NonRepudiationProof',
            resource: por
        })


        const pop = await npProvider.generatePoP()
        const poo = npProvider.block.poo

        await providerOperatorWallet!.resourceCreate({
            type: 'NonRepudiationProof',
            resource: pop.jws
        })


        const verificationRequest = await npProvider.generateVerificationRequest()

        const consumerId = decoded.sub!
        const agreementId = session.batch!.agreementId
        const timestamp = getTimestamp()
        const exchangeId = poo?.payload.exchange.id

        const insert = 'INSERT INTO Accounting(Date, ConsumerId, ExchangeId, AgreementId, Poo, Por, Pop, VerificationRequest, Mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const select = 'SELECT * FROM Accounting WHERE Pop=?'
        const insertParams = [timestamp, consumerId, exchangeId, agreementId, poo?.jws, por, pop?.jws, verificationRequest, mode]
        const selectParams = [pop.jws]

        const db = await openDb()
        const selectResult = await db.all(select, selectParams)

        if (selectResult.length === 0) {
            await db.run(insert, insertParams)
        }

        npsession.set(consumerId, agreementId, npProvider, agreement, payment, mode)

        /* #swagger.responses[200] = { schema: { $ref: "#/components/schemas/popRes" }} */
        res.send({pop: pop.jws})
    } catch (error) {
        next(error)
    }
}
async function listDataSourceFiles(req: Request, res: Response, next: NextFunction) {
        
    try {
        
         // #swagger.tags = ['BatchController']
        // #swagger.description = 'Endpoint to retrieve the list of files from data source.'
        
        const offeringId = req.params.offeringId

        const db = await openDb()
        
        const selectUrl = 'SELECT Url FROM DataSources WHERE OfferingId = ?'
        const selectParams = [offeringId]

        const selectResults = await db.get(selectUrl, selectParams)
        await db.close()

        if (!selectResults) {
            const error = {
                // #swagger.responses[404]
                status: 404,
                path: 'batch.controller.poo',
                name: 'Not found',
                message: `Cant find data source url for offeringId ${offeringId}.`
            }
            throw new HttpError(error)
        } 

        const dataSourceUrl = selectResults.Url

        const files = await listFiles(dataSourceUrl)

        res.send(files)

    } catch (error) {
        next(error)
    }
}

export { poo, pop, listDataSourceFiles }
