import { MqttClient } from "mqtt";
import { Switch } from "../../interfaces/index.js";
import { BinaryMQTTSensor } from "../binary-sensor.js";
import { BASE_TOPIC } from "../../../topics.js";

export class CustomSwitch extends BinaryMQTTSensor implements Switch {
    private logic: (state: boolean, mqtt: MqttClient) => void;

    constructor(name: string, logic: (state: boolean, mqtt: MqttClient) => void) {
        super(name);
        this.logic = logic;
    }
    
    private broadcastState(): void {
        this.client.publish(`${BASE_TOPIC}$switch/${this.name}/state`, this.state ? "ON" : "OFF", { retain: true });
    }

    setOn(): void {
        this.logic(true, this.client);
        this.state = true;
        this.broadcastState();
    }

    setOff(): void {
        this.logic(false, this.client);
        this.state = false;
        this.broadcastState();
    }

    toggle(): void {
        this.logic(!this.state, this.client);
        this.state = !this.state;
        this.broadcastState();
    }

}
