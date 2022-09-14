import * as mqtt from 'mqtt';
import * as sqlite_functions from '../sqliteFunctions/sqliteFunctions';
import * as common from '../commonFunctions/commom';
import * as nrp from '../routes/routes';
import * as crypto from 'crypto'
import { MqttParams } from '../types/openapi'

class Params {
    params: MqttParams
}

function mqttprocess(mqttClient:mqtt.MqttClient){

    let params = new Params().params

    mqttClient.on('connect', function () {
	    console.log("Connected to mqtt broker...\n")
        mqttClient.subscribe('$SYS/broker/log/#')
    })

    mqttClient.on('message', async function (topic, message) {

        console.log(">>>>> "+topic +" " +message.toString())

        if (topic.startsWith("$SYS/broker/log/M/subscribe")) {

            params.messageSplit = message.toString().split(' ');
            topic_subscribed_to = message_split[3]
            timestamp = message_split[0]
            topic_split = message_split[3].split('/')
            consumer_did = topic_split[2]
            data_source_uid = topic_split[3]
        }

        if (topic.startsWith("$SYS/broker/log/M/unsubscribe")) {

            message_split = message.toString().split(' ');
            topic_unsubscribed_to = message_split[2]
            topic_split = message_split[2].split('/')
            consumer_did = topic_split[2]
            data_source_uid = topic_split[3]
        }

        if(topic.startsWith("$SYS/broker/log/M/subscribe") && topic_subscribed_to.startsWith("/to/" + consumer_did)){

            mqttClient.subscribe('/from/'+`${consumer_did}` + `/${data_source_uid}`)
    
            const hash = crypto.createHash('sha256').update(consumer_did+data_source_uid).digest('hex')
            const sub_id = hash.substring(0, 10)
            sqlite_functions.addSubscriberToDatabase(consumer_did, data_source_uid, timestamp.replace(':', ''), sub_id, ammount_of_data_received)
            const action = "subscribe"

  	        sqlite_functions.start_or_end_stream(data_source_uid, action)
        }

        if(topic.startsWith("$SYS/broker/log/M/unsubscribe") && topic_unsubscribed_to.startsWith("/to/" + consumer_did)){
            
            sqlite_functions.deleteConsumerSubscription(consumer_did, data_source_uid)
            mqttClient.unsubscribe('/from/'+`${consumer_did}` + `/${data_source_uid}`)
            const action = "unsubscribe"
            
            sqlite_functions.start_or_end_stream(data_source_uid, action)
            console.log(consumer_did + " unsubscribed!")

        }
        // Response to mqttClient logic here
        if (topic.startsWith('/from/')){
            let npProvider = nrp.getNpProvider()
            let por = JSON.parse(message.toString())
            const poP = await common.validateProofOfReception(por, npProvider)
            //common.NRPcompletenessCheck(npProvider)
            mqttClient.publish('/to/'+`${consumer_did}` + `/${data_source_uid}`, JSON.stringify(poP))
        }

    })
}

export default { mqttprocess }
