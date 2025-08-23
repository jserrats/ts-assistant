import type { StringSensor } from "../../../interfaces/sensor.js";
import { BaseESPHomeSensor } from "./base.js";

//TODO: test this
export class TextSensorESPHome
	extends BaseESPHomeSensor<string>
	implements StringSensor
{
	constructor(name: string, component: string, unit?: string) {
		super(name, component, "text_sensor");
	}

	protected updateComponent(message: string) {
		if (this.state === undefined || this.state !== message) {
			this.state = message;
			super.updateComponent(message);
		}
	}
}
