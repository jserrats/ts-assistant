import { mqttClient } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";

export class PublishMqttAdapter {
	pad: PadXY;
	launchpad: Launchpad;
	constructor(
		launchpad: Launchpad,
		mqtt: { topic: string; payload: string },
		padXY: PadXY,
	) {
		this.pad = padXY;
		this.launchpad = launchpad;
		launchpad.addCallback(padXY, {
			click: () => {
				mqttClient.publish(mqtt.topic, mqtt.payload);
			}
		});
		this.launchpad.setSolidColor(this.pad, Color.WHITE);
	}
}
