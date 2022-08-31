import { NextFunction, Request, Response } from 'express';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import npsession from '../session/np.session';
import { env } from '../config/env';
import { BatchRequest, Agreement } from '../types/openapi';
import { getAgreement, getTimestamp, fetchSignedResolution } from '../common/common';
import { openDb } from '../sqlite/sqlite'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import { SessionSchema } from '../types/openapi'

async function poo (req: Request, res: Response, next: NextFunction) {
    try {

        // Let us define the RPC endopint to the ledger (just in case we don't want to use the default one)
        const dltConfig: Partial<nonRepudiationLibrary.DltConfig> = {
            rpcProviderUrl: env.rpcProviderUrl
        }
                  
        // We are going to directly provide the private key associated to the dataExchange.ledgerSignerAddress. You could also have pass a DltSigner instance to dltConfig.signer in order to use an externam Wallet, such as the i3-MARKET one
        const providerDltSigningKeyHex = env.providerDltSigningKeyHex

        const batchReqParams:BatchRequest = res.locals.reqParams.input
        const agreement: Agreement = await getAgreement(batchReqParams.agreementId)

        console.log(agreement.consumerPublicKey)

        const select = 'SELECT DataExchangeAgreement, ProviderPrivateKey FROM DataExchangeAgreements WHERE ConsumerPublicKey = ? AND ProviderPublicKey = ?'
        const params = [agreement.consumerPublicKey, agreement.providerPublicKey]

        const db = await openDb()

        const selectResult = await db.get(select, params)
        console.log(selectResult)
        if (!selectResult) {
            const error = {
                status: 404,
                path: 'batch.controller.poo',
                name: 'Not found',
                message: 'Cant find dataExchangeAgreement with the Consumer and Provider public key that match the ones from agreement provided.'
            }
            throw new HttpError(error)
        }
        const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = JSON.parse(selectResult.DataExchangeAgreement)
        const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(selectResult.ProviderPrivateKey)
        await db.close()
        
        const block = '{msg:"test"}'
        let buf = Buffer.from(block)

        const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, buf, providerDltSigningKeyHex)
        
        const poo = await npProvider.generatePoO()
        const cipherBlock = npProvider.block.jwe

        const response = {
            poo : poo.jws,
            cipherBlock: cipherBlock
        }

        npsession.set("3412fwe1df", batchReqParams.agreementId, npProvider)

        res.send(response)
    } catch (error) {
            next(error) 
    }
}

async function pop (req: Request, res: Response, next: NextFunction) {
    try {
        const por = req.body.por
        const session: SessionSchema = npsession.get("3412fwe1df")

        const npProvider:nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig = session.npProvider
        await npProvider.verifyPoR(por)
        const pop = await npProvider.generatePoP()
        const poo = npProvider.block.poo

        const verificationRequest = await npProvider.generateVerificationRequest()

        const consumerId = session.consumerId
        const agreementId = session.agreementId
        const timestamp = getTimestamp()
        const exchangeId = poo?.payload.exchange.id

        const insert = 'INSERT INTO Accounting(Date, ConsumerId, ExchangeId, AgreementId, Poo, Por, Pop, VerificationRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        const select = 'SELECT * FROM Accounting WHERE Pop=?'
        const insertParams = [timestamp, consumerId, exchangeId, agreementId, poo?.jws, por, pop?.jws, verificationRequest]
        const selectParams = [pop.jws]

        const db = await openDb()
        const selectResult = await db.all(select, selectParams)
    
        if (selectResult.length === 0) {    
            await db.run(insert, insertParams)
        }

        npsession.set(consumerId, agreementId, npProvider)
        
        res.send(pop)
    } catch (error) {
        next(error)   
    }
}

export { poo, pop }