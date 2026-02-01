import mqtt from "mqtt";
import { getEnvVariable } from "./environment.js";
import { router } from "./router.js";
import * as topic from "./topics.js";

const MQTT_SERVER = getEnvVariable("MQTT_SERVER");

export const client = mqtt.connect(`mqtt://${MQTT_SERVER}`, {
	will: {
		topic: topic.STATUS_TOPIC,
		payload: Buffer.from("offline"),
		retain: true,
	},
});

client.on("connect", () => {
	client.subscribe(`${topic.ZIGBEE2MQTT_TOPIC}#`, (err) => {
		if (!err) {
			client.publish(topic.STATUS_TOPIC, "online");
		}
	});
	client.subscribe(`${topic.ESPHOME_TOPIC}#`);
	client.subscribe(`${topic.BASE_TOPIC}#`);
});

client.on("message", (topic, message,packet) => {
	try {
		router.route(topic, message.toString(), packet);
	} catch (error) {
		console.error(JSON.stringify(error));
	}
});

export const mqttExport = {
    client,
    topics: topic,
};