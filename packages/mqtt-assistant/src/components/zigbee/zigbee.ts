import { ZIGBEE2MQTT_TOPIC } from "../../topics.js";
import { Message, router } from "../../router.js";
import type { Trigger } from "../../types.js";
import { Component, StatefulComponent } from "../component.js";
import type { Eventful } from "../interfaces/eventful.js";
import { exposes } from "./exposes/index.js";
import { ExposesNumber, ExposesZigbee } from "./exposes/base.js";
import mqtt from "mqtt";

const zigbeeDeviceConstructor = (device: ZigbeeDevice, name: string) => {
	device.name = name;
	device.topic = ZIGBEE2MQTT_TOPIC + name;

	router.addAutomation({
		trigger: { topic: device.topic, payload: "*" },
		callback: (message: Message, packet) => {
			try {
				device._updateExposes(JSON.parse(message.payload), packet);
			} catch (error) {
				let error_message = "Unknown Error";
				if (error instanceof Error) error_message = error.message;
				console.error(
					`[!] Error while parsing message:
						TOPIC: ${message.topic}
						PAYLOAD: ${message.payload}
						ERROR: ${error_message}`,
				);
			}
		},
	});
};

export interface ZigbeeDevice extends Eventful {
	topic: string;
	name: string;
	linkquality: exposes.ExposesLinkQuality;
	_updateExposes(message: object, packet?: mqtt.IPublishPacket): void;
}

export class StatelessZigbeeDevice extends Component implements ZigbeeDevice {
	topic: string;
	name: string;
	linkquality: ExposesNumber = new exposes.ExposesLinkQuality(this);

	constructor(name: string) {
		super();
		zigbeeDeviceConstructor(this, name);
		router.addAutomation({
			trigger: { topic: `${this.topic}/availability`, payload: "*" },
			callback: (message: Trigger) => {
				try {
					if (JSON.parse(message.payload).state === "offline") {
						// set all exposes of this device to undefined
						for (const key in this) {
							if (this[key] instanceof ExposesZigbee) {
								this[key]._updateExposes(undefined);
							}
						}
					}
				} catch (error) {
					let error_message = "Unknown Error";
					if (error instanceof Error) error_message = error.message;
					console.error(
						`[!] Error while parsing message:
							TOPIC: ${message.topic}
							PAYLOAD: ${message.payload}
							ERROR: ${error_message}`,
					);
				}
			},
		});
	}

	_updateExposes(message: object): void {
		for (const key in this) {
			if (this[key] instanceof ExposesZigbee) {
				this[key]._updateExposes(message);
			}
		}
	}
}

export class StatefulZigbeeDevice<T extends string | number | boolean | undefined>
	extends StatefulComponent<T>
	implements ZigbeeDevice {
	topic: string;
	name: string;
	linkquality: ExposesNumber = new exposes.ExposesLinkQuality(this);
	private offline_state: T;

	constructor(name: string) {
		super();
		zigbeeDeviceConstructor(this, name);
		router.addAutomation({
			trigger: { topic: `${this.topic}/availability`, payload: "*" },
			callback: (message: Trigger) => {
				try {
					if (JSON.parse(message.payload).state === "offline") {
						this.offline_state = this.state;
						this.state = undefined;
					} else if (
						JSON.parse(message.payload).state === "online" &&
						this.state === undefined
					) {
						this.state = this.offline_state;
					}
				} catch (error) {
					let error_message = "Unknown Error";
					if (error instanceof Error) error_message = error.message;
					console.error(
						`[!] Error while parsing message:
							TOPIC: ${message.topic}
							PAYLOAD: ${message.payload}
							ERROR: ${error_message}`,
					);
				}
			},
		});
	}

	//TODO: deduplicate this code
	_updateExposes(message: object): void {
		for (const key in this) {
			if (this[key] instanceof ExposesZigbee) {
				this[key]._updateExposes(message);
			}
		}
	}
}
