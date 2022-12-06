import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { Request, NextFunction, Response } from 'express';
import { getAgreement, getAgreementState, getTimestamp } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { Mode, StreamResponse, StreamSubscribersRow } from '../types/openapi';
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

        const offeringId = req.body.offeringId
        const description = req.body.description
        const url = req.body.url
        const action = req.body.action

        const timestamp = getTimestamp()

        const db = await openDb()

        const insert = 'INSERT INTO DataSources(OfferingId, Description, Url, Timestamp) VALUES (?, ?, ?, ?)'
        const select = 'SELECT * FROM DataSources WHERE OfferingId=?'
        const unregister = 'DELETE FROM DataSources WHERE OfferingId=?'

        const selectParams = [offeringId]
        const deregisterParams = [offeringId]
        const insertParams = [offeringId, description, url, timestamp]

        if (action === 'register') {

            const selectResult = await db.get(select, selectParams)

            if (selectResult === undefined) {
                await db.run(insert, insertParams)
                await db.close()

                res.status(200).send('OK')
            } else {
                res.send({ msg: `Data source with offeringId ${offeringId} already registered` })
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
        const offeringId = req.params.offeringId

        const client = mqttinit.get('client')

        const rawBufferData = Buffer.from(data)
        const dataSent = rawBufferData.length

        const db = await openDb()

        const select = 'SELECT * FROM StreamSubscribers WHERE OfferingId=?'
        const selectParams = [offeringId]

        const selectResult = await db.all(select, selectParams)

        selectResult.forEach(async (row: StreamSubscribersRow) => {

            //const agreement: Agreement = await getAgreement(Number(row.AgreementId))
            const agreementId = Number(row.AgreementId)

            const select = 'SELECT DataExchangeAgreement, ProviderPrivateKey, ConsumerPublicKey FROM DataExchangeAgreements WHERE AgreementId = ?'
            const selectParams = [agreementId]

            const selectResult = await db.get(select, selectParams)
            
            if(!selectResult) {
                client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Cant find dataExchangeAgreement for agreementId ${agreementId}...`, {qos:2})
            } else {

                let session: Mode = npsession.get(row.ConsumerDid)
        
                if (session === undefined || session.stream?.agreementId !== agreementId) {
                    const agreement = await getAgreement(agreementId)
                    session = {
                        stream: {
                            agreementId: agreementId,
                            agreement: agreement
                    
                        }
                    }
                }
            
                const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = JSON.parse(selectResult.DataExchangeAgreement)
                dataExchangeAgreement.orig = JSON.stringify(dataExchangeAgreement.orig)
                dataExchangeAgreement.dest = JSON.stringify(dataExchangeAgreement.dest)

                const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(selectResult.ProviderPrivateKey)

                const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, env.providerDltSigningKeyHex)
                const poo = await npProvider.generatePoO()

                const streamDaaResponse: StreamResponse = { poo: poo.jws, cipherBlock: npProvider.block.jwe }

                const agreementState = await getAgreementState(agreementId)
            
                if (agreementState.state === 'active') {
                    client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, JSON.stringify(streamDaaResponse), {qos:2})
                } else {
                    client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Agreement with agreementId ${agreementId} is not active...`, {qos:2})
                }
            
                const agreement = session.stream?.agreement!
                npsession.set(row.ConsumerDid, Number(row.AgreementId), npProvider, agreement, mode)

                const ammountOfDataReceived = Number(row.AmmountOfDataReceived) + dataSent

                const update = 'UPDATE StreamSubscribers SET AmmountOfDataReceived=? WHERE SubId=?'
                const updateParams = [ammountOfDataReceived, row.SubId]

                await db.run(update, updateParams)
                await db.close()
                }
            })
            res.send({ msg: 'Data sent to broker' })
        } catch (error) {
            next(error)
        }
}