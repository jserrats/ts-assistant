import { randomUUID } from "node:crypto";
import type { TextSensor } from "../interfaces/sensor.js";
import { BaseMQTTSensor } from "./base.js";

export class TextMQTTSensor
	extends BaseMQTTSensor<string>
	implements TextSensor {
	public override events = {
		/** Emitted when the state property of the object is updated
		 */
		state: randomUUID(),
	};

	constructor(name) {
		super(name);
	}
	override updateComponent(message: string) {
		this.state = message
		super.updateComponent(message);

	}
}
