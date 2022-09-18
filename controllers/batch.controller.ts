import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { BatchRequest, Agreement, BatchDaaResponse, JsonMapOfData, Mode } from '../types/openapi';
import { getAgreement, getTimestamp, checkFile, responseData, deployRawPaymentTransaction } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import * as fs from 'fs';
import jwtDecode, { JwtPayload } from "jwt-decode";
import npsession from '../session/np.session';

async function poo(req: Request, res: Response, next: NextFunction) {
    try {

        const mode = 'batch'
        // Let us define the RPC endopint to the ledger (just in case we don't want to use the default one)
        const dltConfig: Partial<nonRepudiationLibrary.DltConfig> = {
            rpcProviderUrl: env.rpcProviderUrl
        }

        // We are going to directly provide the private key associated to the dataExchange.ledgerSignerAddress. You could also have pass a DltSigner instance to dltConfig.signer in order to use an externam Wallet, such as the i3-MARKET one
        const providerDltSigningKeyHex = env.providerDltSigningKeyHex

        const batchReqParams: BatchRequest = res.locals.reqParams.input
        const agreement: Agreement = await getAgreement(batchReqParams.agreementId)

        const signature = batchReqParams.signature
        const blockId = batchReqParams.blockId
        const blockAck = batchReqParams.blockAck
        const data = batchReqParams.data

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)

        const resourceMapPath = `./data/${data}.json`
        const resourcePath = `./data/${data}`

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

        if (fs.existsSync(resourcePath)) {
            console.log('The resource exists')

            if (blockId == 'null') {

                const check = checkFile(resourceMapPath, resourcePath);
                console.log('File checked')

            }
            const map = fs.readFileSync(resourceMapPath, 'utf8');
            const jsonMapOfData: JsonMapOfData = JSON.parse(map);

            if (blockId === 'null' && blockAck === 'null') {

                const index = Object.keys(jsonMapOfData.records[0])

                const nextBlockId = index[0]
                const batchDaaResponse: BatchDaaResponse = { blockId: "null", nextBlockId: nextBlockId, poo: "null", cipherBlock: "null" }

                console.log(`Daa response is ${batchDaaResponse}`)

                res.send(batchDaaResponse)

            } else if ((blockId != 'null' && blockAck == 'null') || (blockId != 'null' && blockAck != 'null')) {

                const response = await responseData(blockId, jsonMapOfData, resourcePath);
                const rawBufferData = response.data
                const nextBlockId = response.nextBlockId

                console.log('Buffer size: ' + rawBufferData.length)

                const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, providerDltSigningKeyHex)

                const poo = await npProvider.generatePoO()
                const cipherBlock = npProvider.block.jwe

                const batchDaaResponse: BatchDaaResponse = { blockId: blockId, nextBlockId: nextBlockId, poo: poo.jws, cipherBlock: cipherBlock }

                npsession.set(decoded.sub!, batchReqParams.agreementId, npProvider, mode)

                res.send(batchDaaResponse)

            } else if (blockId == 'null' && blockAck != 'null') {

                const transactionObject = await deployRawPaymentTransaction(signature)
                const batchDaaResponse: BatchDaaResponse = { blockId: "null", nextBlockId: "null", poo: "null", cipherBlock: "null", "transactionObject": transactionObject }

                res.send(batchDaaResponse);
            }
        } else {
            const error = {
                status: 404,
                path: 'batch.controller.poo',
                name: 'Not found',
                message: `Cant find ${data}.`
            }
            throw new HttpError(error)
        }
    } catch (error) {
        next(error)
    }
}

async function pop(req: Request, res: Response, next: NextFunction) {
    try {
        const mode = 'batch'

        const por = req.body.por

        const bearerToken = req.header('authorization')?.replace("Bearer ", "")
        const decoded = jwtDecode<JwtPayload>(bearerToken!)

        const session: Mode = npsession.get(decoded.sub!)

        const npProvider: nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig = session.batch!.npProvider
        await npProvider.verifyPoR(por)
        const pop = await npProvider.generatePoP()
        const poo = npProvider.block.poo

        const verificationRequest = await npProvider.generateVerificationRequest()

        const consumerId = decoded.sub!
        const agreementId = session.batch!.agreementId
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

        npsession.set(consumerId, agreementId, npProvider, mode)

        res.send(pop)
    } catch (error) {
        next(error)
    }
}

export { poo, pop }
