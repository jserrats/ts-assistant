import type { UUID } from "node:crypto";
import type { TimerLength } from "../timer.js";
import type { BooleanSensor } from "./sensor.js";

export interface Switch extends BooleanSensor {
	get state(): boolean;
	setOn(options?: object): void;
	setOff(): void;
	toggle(): void;
	newTimeStateEvent(
		time: TimerLength,
		logic: (state: boolean) => boolean,
	): UUID;
}
