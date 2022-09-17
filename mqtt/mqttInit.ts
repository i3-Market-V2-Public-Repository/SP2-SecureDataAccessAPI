import * as mqtt from 'mqtt';
import { MqttOptions } from '../types/openapi'

class MqttInit {

    

    options: MqttOptions = {
        clientId: "data-access-api",
        username: "DataAccessApi",
        password: "pa$$w0rd",
        clean: false
    };

    // set() {
    //     console.log("Data-access connecting to broker...\n")
    //     this.mqttClient = mqtt.connect('mqtt://mqtt-broker:1883', this.options)
    // }
    
    mqttClient: mqtt.MqttClient = mqtt.connect('mqtt://mqtt-broker:1883', this.options)

    get() {
        return this.mqttClient
    }
}

let mqttinit = new MqttInit();

export default mqttinit


