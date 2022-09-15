import * as mqtt from 'mqtt';
import * as crypto from 'crypto'
import { MqttParams, DataSourcesRow } from '../types/openapi'
import { openDb } from '../sqlite/sqlite';
import { env } from '../config/env';
const DigestFetch = require('digest-fetch');
export async function mqttprocess(mqttClient: mqtt.MqttClient) {

    let params: MqttParams

    params.ammountOfDataReceived = 0

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
            params.dataSourceUid = params.topicSplit[3]
            params.agreementId = params.topicSplit[4]
        }

        if (topic.startsWith("$SYS/broker/log/M/unsubscribe")) {

            params.messageSplit = message.toString().split(' ');
            params.topicUnsubscribedTo = params.messageSplit[2]
            params.topicSplit = params.messageSplit[2].split('/')
            params.consumerDid = params.topicSplit[2]
            params.dataSourceUid = params.topicSplit[3]
            params.agreementId = params.topicSplit[4]
        }

        if (topic.startsWith("$SYS/broker/log/M/subscribe") && params.topicSubscribedTo.startsWith(`/to/${params.consumerDid}`)) {

            mqttClient.subscribe(`/from/${params.consumerDid}/${params.dataSourceUid}/${params.agreementId}`)

            const hash = crypto.createHash('sha256').update(params.consumerDid + params.dataSourceUid).digest('hex')
            const subId = hash.substring(0, 10)

            const db = await openDb()

            const insert = 'INSERT INTO StreamSubscribers(ConsumerDid, DataSourceUid, AgreementId, Timestamp, SubId, AmmountOfDataReceived) VALUES (?, ?, ?, ?, ?, ?)'
            const select = 'SELECT * FROM StreamSubscribers WHERE ConsumerDid=? AND DataSourceUid=?'

            const insertParams = [params.consumerDid, params.dataSourceUid, params.timestamp.replace(':', ''), subId, params.ammountOfDataReceived]
            const selectParams = [params.consumerDid, params.dataSourceUid]

            const selectResult = await db.get(select, selectParams)

            if (selectResult == undefined) {
                await db.run(insert, insertParams)
            }

            await db.close()

            startStream(params.dataSourceUid)
        }

        if (topic.startsWith("$SYS/broker/log/M/unsubscribe") && params.topicUnsubscribedTo.startsWith(`/to/${params.consumerDid}`)) {

            const db = await openDb()

            const remove = 'DELETE FROM StreamSubscribers WHERE ConsumerDid=? AND DataSourceUid=?'
            const removeParams = [params.consumerDid, params.dataSourceUid]

            await db.run(remove, removeParams)

            await db.close()

            mqttClient.unsubscribe(`/from/${params.consumerDid}/${params.dataSourceUid}/${params.agreementId}`)

            console.log(`${params.consumerDid} unsubscribed...`)

            endStream(params.dataSourceUid)
        }
        if (topic.startsWith('/from/')) {
            let npProvider = nrp.getNpProvider()
            let por = JSON.parse(message.toString())
            const poP = await common.validateProofOfReception(por, npProvider)
            //common.NRPcompletenessCheck(npProvider)
            mqttClient.publish('/to/' + `${params.consumerDid}` + `/${params.dataSourceUid}`, JSON.stringify(poP))
        }

    })
}

async function startStream(dataSourceUid: string) {

    const db = await openDb()

    const select = 'SELECT * FROM DataSources WHERE Uid=?'
    const selectParams = [dataSourceUid]

    const selectResult = await db.all(select, selectParams)

    await db.close()

    if (selectResult.length !== 0) {

        selectResult.forEach(async (row: DataSourcesRow) => {

            const client = new DigestFetch(env.dataSpaceUser, env.dataSpacePassword)
            await client.fetch(`${row.Url}/subscribe`, {
                method: 'GET',
            })

            console.log(`Data source ${row.Uid} instructed to send data now...`)
        });
    }
}

async function endStream(dataSourceUid: string) {

    const db = await openDb()

    const select = 'SELECT FROM StreamSubscribers WHERE DataSourceUid=?'
    const selectParams = [dataSourceUid]

    const selectResult = await db.get(select, selectParams)

    if(selectResult === undefined) {

        const select = 'SELECT FROM DataSources WHERE Uid=?'
        const selectParams = [dataSourceUid]

        const selectResult: DataSourcesRow = await db.get(select, selectParams)

        if (selectResult !== undefined) {

            const client = new DigestFetch(env.dataSpaceUser, env.dataSpacePassword)
            await client.fetch(`${selectResult.Url}/unsubscribe`, {
                method: 'GET',
            })
            console.log(`Data source ${selectResult.Uid} has no more subscribers to send data to...`)
        }
    }
    await db.close()
}

export default { mqttprocess }
