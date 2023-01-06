import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';
import { Request, NextFunction, Response } from 'express';
import { getAgreement, getAgreementState } from '../common/common';
import { openDb } from '../sqlite/sqlite';
import { Mode, StreamResponse, StreamSubscribersRow } from '../types/openapi';
import { env } from '../config/env';
import mqttinit from '../mqtt/mqttInit';
import npsession from '../session/np.session';
import providerWallet from '../config/providerOperatorWallet';
import { parseJwk } from '@i3m/non-repudiation-library';

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
        console.log(selectResult)

        selectResult.forEach(async (row: StreamSubscribersRow) => {

            //const agreement: Agreement = await getAgreement(Number(row.AgreementId))
            const agreementId = Number(row.AgreementId)

            let session: Mode = npsession.get(row.ConsumerDid)

            if (session === undefined || session.stream?.agreementId !== agreementId) {
                const agreement = await getAgreement(agreementId)
                session = {
                    stream: {
                        agreementId: agreementId,
                        agreement: agreement,
                        payment: false
                    }
                }
            }

            if (session.stream?.agreement.dataStream === true){

                if (session.batch?.agreement.pricingModel.fee === 0 ) {
                    session.batch.payment = true
                }
                

                if (session.batch?.payment === false) {
                    const selectPayment = 'SELECT Payment, ConsumerDid FROM MarketFeePayments WHERE AgreementId = ?'
                    const selectPaymentParams = [agreementId]
        
                    const selectPaymentResult = await db.get(selectPayment, selectPaymentParams)
                    console.log(selectPaymentResult)

                    if (!selectPaymentResult) {
                        client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Consumer with did ${row.ConsumerDid} didn't pay for agreementId ${agreementId}...`, {qos:2})
                    } else {
                        session.batch.payment = true
                    }
                    
                }

                if (session.batch!.payment === true) {

                    const select = 'SELECT DataExchangeAgreement, ProviderPrivateKey, ConsumerPublicKey FROM DataExchangeAgreements WHERE AgreementId = ?'
                    const selectParams = [agreementId]

                    const selectResult = await db.get(select, selectParams)
                    console.log(selectResult)
                    
                    if(!selectResult) {
                        client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Cant find dataExchangeAgreement for agreementId ${agreementId}...`, {qos:2})
                    } else {
                
                        const dataExchangeAgreement: nonRepudiationLibrary.DataExchangeAgreement = JSON.parse(selectResult.DataExchangeAgreement)

                        dataExchangeAgreement.orig = await parseJwk(JSON.parse(dataExchangeAgreement.orig), true)
                        dataExchangeAgreement.dest = await parseJwk(JSON.parse(dataExchangeAgreement.dest), true)

                        const providerPrivateKey: nonRepudiationLibrary.JWK = JSON.parse(selectResult.ProviderPrivateKey)

                        const providerOperatorWallet = providerWallet.getProviderOperatorWallet()
                        const providerDid = providerWallet.getProviderDid()

                        const providerDltAgent = new nonRepudiationLibrary.I3mServerWalletAgentOrig(providerOperatorWallet!, providerDid!)

                        const npProvider = new nonRepudiationLibrary.NonRepudiationProtocol.NonRepudiationOrig(dataExchangeAgreement, providerPrivateKey, rawBufferData, providerDltAgent)
                        const poo = await npProvider.generatePoO()

                        // Store PoO in the wallet
                        await providerOperatorWallet!.resourceCreate({
                            type: 'NonRepudiationProof',
                            resource: poo.jws
                        })

                        const streamDaaResponse: StreamResponse = { poo: poo.jws, cipherBlock: npProvider.block.jwe }

                        const agreementState = await getAgreementState(agreementId)
                
                        if (agreementState.state === 'active') {
                            client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, JSON.stringify(streamDaaResponse), {qos:2})
                        } else {
                            client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Agreement with agreementId ${agreementId} is not active...`, {qos:2})
                        }
                
                        const agreement = session.stream?.agreement!
                        const payment = session.stream?.payment!

                        npsession.set(row.ConsumerDid, Number(row.AgreementId), npProvider, agreement, payment, mode)

                        const ammountOfDataReceived = Number(row.AmmountOfDataReceived) + dataSent

                        const update = 'UPDATE StreamSubscribers SET AmmountOfDataReceived=? WHERE SubId=?'
                        const updateParams = [ammountOfDataReceived, row.SubId]

                        await db.run(update, updateParams)
                        await db.close()
                    }
                }
            } else {
                client.publish(`/to/${row.ConsumerDid}/${row.OfferingId}/${row.AgreementId}`, `ErrorMessage: Agreement with agreementId ${agreementId} has dataStream field as false. For stream transfer it is expected to be true.`, {qos:2})
            }
        })
            res.send({ msg: 'Data sent to broker' })
        } catch (error) {
            next(error)
        }
}