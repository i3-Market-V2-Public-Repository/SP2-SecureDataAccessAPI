import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { Request, NextFunction, Response } from 'express';
import { getAgreement, getTimestamp } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { Agreement, StreamResponse, StreamSubscribersRow } from '../types/openapi';
import { env } from '../config/env';
import mqttinit from '../mqtt/mqttInit';
import npsession from '../session/np.session';

export async function registerDataSource(req: Request, res: Response, next: NextFunction) {

    try {

        // #swagger.tags = ['StreamController']
        // #swagger.description = 'Endpoint to register or unregister a datasource.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/regdsReq" }
                        }
                    }
        } 
        */

        const uid = req.body.uid
        const description = req.body.description
        const url = req.body.url
        const action = req.body.action

        const timestamp = getTimestamp()

        const db = await openDb()

        const insert = 'INSERT INTO DataSources(Uid, Description, Url, Timestamp) VALUES (?, ?, ?, ?)'
        const select = 'SELECT * FROM DataSources WHERE Uid=?'
        const unregister = 'DELETE FROM DataSources WHERE Uid=?'

        const selectParams = [uid]
        const deregisterParams = [uid]
        const insertParams = [uid, description, url, timestamp]

        if (action === 'register') {

            const selectResult = await db.get(select, selectParams)

            if (selectResult === undefined) {
                await db.run(insert, insertParams)
                await db.close()

                res.status(200).send('OK')
            } else {
                res.send({ msg: `Data source with uid ${uid} already registered` })
            }

        }
        if (action === 'unregister') {
            await db.run(unregister, deregisterParams)

            res.status(200).send('OK')
        }
    } catch (error) {
        next(error)
    }
}

export async function newData(req: Request, res: Response, next: NextFunction) {
    try {

        // #swagger.tags = ['StreamController']
        // #swagger.description = 'Endpoint for the datasource to send data to. The data will be forwarded to the mqtt broker.'

        /* 
        #swagger.requestBody = {
            required: true,
                content : {
                    "application/octet-stream": {
                        }
                    }
        } 
        */

        const mode = 'stream'

        const data = req.body
        const uid = req.params.uid

        const client = mqttinit.get('client')

        const rawBufferData = Buffer.from(data)
        const dataSent = rawBufferData.length

        const db = await openDb()

        const select = 'SELECT * FROM StreamSubscribers WHERE DataSourceUid=?'
        const selectParams = [uid]

        const selectResult = await db.all(select, selectParams)

        console.log(selectResult) //to delete

        selectResult.forEach(async (row: StreamSubscribersRow) => {

            const agreement: Agreement = await getAgreement(Number(row.AgreementId))

            const select = 'SELECT DataExchangeAgreement, ProviderPrivateKey FROM DataExchangeAgreements WHERE ConsumerPublicKey = ? AND ProviderPublicKey = ?'
            const selectParams = [agreement.consumerPublicKey, agreement.providerPublicKey]

            const selectResult = await db.get(select, selectParams)

            const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = JSON.parse(selectResult.DataExchangeAgreement)
            const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(selectResult.ProviderPrivateKey)

            const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, env.providerDltSigningKeyHex)
            const poo = await npProvider.generatePoO()

            const streamDaaResponse: StreamResponse = { poo: poo.jws, cipherBlock: npProvider.block.jwe }

            client.publish(`/to/${row.ConsumerDid}/${row.DataSourceUid}/${row.AgreementId}`, JSON.stringify(streamDaaResponse))

            npsession.set(row.ConsumerDid, Number(row.AgreementId), npProvider, mode)

            const ammountOfDataReceived = Number(row.AmmountOfDataReceived) + dataSent

            const update = 'UPDATE StreamSubscribers SET AmmountOfDataReceived=? WHERE SubId=?'
            const updateParams = [ammountOfDataReceived, row.SubId]

            await db.run(update, updateParams)
        })

        res.send({ msg: 'Data sent to broker' })
    } catch (error) {
        next(error)
    }
}