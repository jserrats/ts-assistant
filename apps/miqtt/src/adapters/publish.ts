import { mqtt } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";

export class PublishMqttAdapter {
	pad: PadXY;
	launchpad: Launchpad;
	constructor(
		launchpad: Launchpad,
		mqttSettings: { topic: string; payload: string },
		padXY: PadXY,
	) {
		this.pad = padXY;
		this.launchpad = launchpad;
		launchpad.addCallback(padXY, {
			click: () => {
				mqtt.client.publish(mqttSettings.topic, mqttSettings.payload);
			}
		});
		this.launchpad.setSolidColor(this.pad, Color.WHITE);
	}
}
