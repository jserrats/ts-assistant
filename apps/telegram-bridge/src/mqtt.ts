import mqtt from "mqtt";
import { mqtt as config } from "@ts-assistant/mqtt-assistant"
import { Outbound } from "./outbound";


export function initMqtt(outbound: Outbound) {

    const STATUS_TOPIC = config.topics.TELEGRAM_BASE_TOPIC + "status";
    const MQTT_SERVER = process.env.MQTT_SERVER;
    if (MQTT_SERVER === undefined) {
        throw new Error("[!] Missing MQTT_SERVER")
    }

    const client = mqtt.connect("mqtt://" + MQTT_SERVER, {
        will: { topic: STATUS_TOPIC, payload: Buffer.from("offline") }
    });

    client.on("connect", () => {
        client.subscribe(config.topics.TELEGRAM_BASE_TOPIC + "#", (err) => {
            if (!err) {
                client.publish(STATUS_TOPIC, "online", { retain: true });
            }
        });
    });

    client.on("message", (topic, message) => {
        if (topic.slice(-1) === "/") {
            // removes trailing /
            topic = topic.slice(0, -1)
        }
        if (topic[0] === "/") {
            // removes heading /
            topic = topic.slice(1)
        }

        if (topic !== STATUS_TOPIC){
            outbound.handle(topic, message.toString());
        }
    });

    return client
}
