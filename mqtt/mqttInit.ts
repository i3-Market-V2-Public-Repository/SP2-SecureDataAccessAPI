import { MqttOptions } from '../types/openapi';
import * as mqtt from 'mqtt';

class MqttInit {

    mqttClient: Record<string, mqtt.MqttClient> = {}

    options: MqttOptions = {
        clientId: "data-access-api",
        username: "DataAccessApi",
        password: "pa$$w0rd",
        clean: false
    };

    set(client: string) {
        console.log("Data-access connecting to broker...\n")
        this.mqttClient[client] = mqtt.connect('mqtt://mqtt-broker:1883', this.options)
    }
    
    get(client: string) {
        return this.mqttClient[client]
    }
}

let mqttinit = new MqttInit();

export default mqttinit


