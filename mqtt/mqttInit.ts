import * as mqtt from 'mqtt';
import { MqttOptions } from '../types/openapi'

class MqttInit {

    _mqttClient: mqtt.MqttClient

    options: MqttOptions = {
        clientId: "data-access-api",
        username: "DataAccessApi",
        password: "pa$$w0rd",
        clean: false
    };

    mqttInit() {
        console.log("Data-access connecting to broker...\n")
        this._mqttClient = mqtt.connect('mqtt://mqtt-broker:1883', this.options)
    }

    get() {
        return this._mqttClient
    }
}

let mqttinit = new MqttInit();

export default mqttinit


