import { randomUUID } from "node:crypto";
import type { BooleanSensor } from "../../../interfaces/sensor.js";
import { BaseESPHomeSensor } from "./base.js";

export class BinarySensorESPHome
	extends BaseESPHomeSensor<boolean>
	implements BooleanSensor
{
	public override events = {
		/** Emitted when the state property of the object is updated
		 */
		state: randomUUID(),
		/** Emitted when the state property of the object is true
		 */
		on: randomUUID(),
		/** Emitted when the state property of the object is false
		 */
		off: randomUUID(),
	};

	constructor(name: string, component: string) {
		super(name, component, "binary_sensor");
		this.on(this.events.state, () => {
			if (this.state) {
				this.emit(this.events.on);
			} else {
				this.emit(this.events.off);
			}
		});
	}

	protected override updateComponent(message: string) {
		if (this.state === undefined || this.state !== (message === "ON")) {
			this.state = message === "ON";
			super.updateComponent(message);
		}
	}
}
