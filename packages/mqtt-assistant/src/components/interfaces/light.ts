import type { Switch } from "./switch.js";

export type Light = Switch

export interface BrightLight extends Light {
	brightness: {
		max: number;
		min: number;
		set(level: number): void;
		state: number | undefined;
	};
}

export interface TemperatureLight extends BrightLight {
	colorTemp: {
		max: number;
		min: number;
		set(level: number): void;
		state: number | undefined;
	};
}
