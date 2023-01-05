import { MqttParams, DataSourcesRow } from '../types/openapi';
import { openDb } from '../sqlite/sqlite';
import { env } from '../config/env';
import { getTimestamp } from '../common/common';
import * as mqtt from 'mqtt';
import * as crypto from 'crypto';
import npsession from '../session/np.session';
import providerWallet from '../config/providerOperatorWallet';
import * as nonRepudiationLibrary from '@i3m/non-repudiation-library';

const DigestFetch = require('digest-fetch');

export async function mqttProcess(mqttClient: mqtt.MqttClient) {

    let params: MqttParams = {
        messageSplit: [],
        topicSplit: [],
        consumerDid: '',
        offeringId: '',
        timestamp: '',
        topicSubscribedTo: '',
        topicUnsubscribedTo: '',
        agreementId: '',
        ammountOfDataReceived: 0
    }

    mqttClient.on('connect', function () {
        console.log("Connected to mqtt broker...\n")
        mqttClient.subscribe('$SYS/broker/log/#')
    })

    mqttClient.on('message', async function (topic, message) {

        console.log(">>>>> " + topic + " " + message.toString())

        if (topic.startsWith("$SYS/broker/log/M/subscribe")) {

            params.messageSplit = message.toString().split(' ');
            params.topicSubscribedTo = params.messageSplit[3]
            params.timestamp = params.messageSplit[0]
            params.topicSplit = params.messageSplit[3].split('/')
            params.consumerDid = params.topicSplit[2]
            params.offeringId = params.topicSplit[3]
            params.agreementId = params.topicSplit[4]
        }

        if (topic.startsWith("$SYS/broker/log/M/unsubscribe")) {

            params.messageSplit = message.toString().split(' ');
            params.topicUnsubscribedTo = params.messageSplit[2]
            params.topicSplit = params.messageSplit[2].split('/')
            params.consumerDid = params.topicSplit[2]
            params.offeringId = params.topicSplit[3]
            params.agreementId = params.topicSplit[4]
        }

        if (topic.startsWith("$SYS/broker/log/M/subscribe") && params.topicSubscribedTo.startsWith(`/to/${params.consumerDid}`)) {

            mqttClient.subscribe(`/from/${params.consumerDid}/${params.offeringId}/${params.agreementId}`, {qos:2})

            const hash = crypto.createHash('sha256').update(params.consumerDid + params.offeringId).digest('hex')
            const subId = hash.substring(0, 10)

            const db = await openDb()

            const insert = 'INSERT INTO StreamSubscribers(ConsumerDid, OfferingId, AgreementId, Timestamp, SubId, AmmountOfDataReceived) VALUES (?, ?, ?, ?, ?, ?)'
            const select = 'SELECT * FROM StreamSubscribers WHERE ConsumerDid=? AND OfferingId=?'

            const insertParams = [params.consumerDid, params.offeringId, params.agreementId, params.timestamp.replace(':', ''), subId, params.ammountOfDataReceived]
            const selectParams = [params.consumerDid, params.offeringId]

            const selectResult = await db.get(select, selectParams)
            
            if (selectResult === undefined) {
                await db.run(insert, insertParams)
            }

            await db.close()

            startStream(params.offeringId)

        }

        if (topic.startsWith("$SYS/broker/log/M/unsubscribe") && params.topicUnsubscribedTo.startsWith(`/to/${params.consumerDid}`)) {

            const db = await openDb()

            const remove = 'DELETE * FROM StreamSubscribers WHERE ConsumerDid=? AND OfferingId=?'
            const removeParams = [params.consumerDid, params.offeringId]

            await db.run(remove, removeParams)

            await db.close()

            mqttClient.unsubscribe(`/from/${params.consumerDid}/${params.offeringId}/${params.agreementId}`)

            console.log(`${params.consumerDid} unsubscribed...`)

            endStream(params.offeringId)
        }
        if (topic.startsWith('/from/')) {

            const mode = 'stream'

            const session = npsession.get(params.consumerDid)
            const npProvider = session.stream!.npProvider!


            const providerOperatorWallet = providerWallet.getProviderOperatorWallet()
            const providerDid = providerWallet.getProviderDid()

            const providerDltAgent = new nonRepudiationLibrary.I3mServerWalletAgentOrig(providerOperatorWallet!, providerDid!)

            const por = JSON.parse(message.toString())

            await npProvider.verifyPoR(por)

            // Store PoR in the wallet
            await providerOperatorWallet!.resourceCreate({
                type: 'NonRepudiationProof',
                resource: por.jws
            })

            const pop = await npProvider.generatePoP()

            // Store PoP in the wallet
            await providerOperatorWallet!.resourceCreate({
                type: 'NonRepudiationProof',
                resource: pop.jws
            })

            const poo = npProvider.block.poo
            
            const verificationRequest = await npProvider.generateVerificationRequest()
    
            const consumerId = params.consumerDid
            const agreementId = session.stream!.agreementId
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

            mqttClient.publish(`/to/${params.consumerDid}/${params.offeringId}/${agreementId}`, JSON.stringify(pop), {qos:2})

            const agreement = session.stream?.agreement!
            const payment = session.stream?.payment!

            npsession.set(consumerId, agreementId, npProvider, agreement, payment, mode)
        }

    })
}

async function startStream(offeringId: string) {

    const db = await openDb()

    const select = 'SELECT * FROM DataSources WHERE OfferingId=?'
    const selectParams = [offeringId]

    const selectResult = await db.all(select, selectParams)

    await db.close()

    if (selectResult.length !== 0) {

        selectResult.forEach(async (row: DataSourcesRow) => {

            const client = new DigestFetch(env.dataSpaceUser, env.dataSpacePassword)
            try {
                await client.fetch(`${row.Url}/subscribe`, {
                    method: 'GET',
                })
    
                console.log(`Data source ${row.OfferingId} instructed to send data now...`)
            } catch (error) {
                console.log(`Cant reach ${row.Url} for data source ${row.OfferingId}`)
            }

        });
    }
}

async function endStream(offeringId: string) {

    const db = await openDb()

    const select = 'SELECT FROM StreamSubscribers WHERE OfferingId=?'
    const selectParams = [offeringId]

    const selectResult = await db.get(select, selectParams)

    if(selectResult === undefined) {

        const select = 'SELECT FROM DataSources WHERE OfferingId=?'
        const selectParams = [offeringId]

        const selectResult: DataSourcesRow | undefined = await db.get(select, selectParams)

        if (selectResult !== undefined) {

            const client = new DigestFetch(env.dataSpaceUser, env.dataSpacePassword)

            try {
                await client.fetch(`${selectResult.Url}/unsubscribe`, {
                    method: 'GET',
                })
                console.log(`Data source ${selectResult.OfferingId} has no more subscribers to send data to...`)
            } catch (error) {
                console.log(`Cant reach ${selectResult.OfferingId} for data source ${selectResult.OfferingId}`)
            }
            
        }
    }
    await db.close()
}

export default { mqttProcess }
