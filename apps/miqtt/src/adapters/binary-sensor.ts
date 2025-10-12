import type { interfaces } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import type { Adapter } from "./adapter";

export class BinarySensorAdapter implements Adapter {
	component: interfaces.BooleanSensor;
	pad: PadXY;
	launchpad: Launchpad;

	constructor(
		component: interfaces.BooleanSensor,
		launchpad: Launchpad,
		padXY: PadXY,
	) {
		this.component = component;
		this.pad = padXY;
		this.launchpad = launchpad;
		this.updatePadColor(component.state);
		this.component.on(this.component.events.state, (state: boolean) => {
			this.updatePadColor(state);
		});
	}

	private updatePadColor(state?: boolean) {
		if (state === undefined) {
			this.launchpad.setSolidColor(this.pad, Color.STATE_UNDEFINED);
		} else {
			this.launchpad.setSolidColor(
				this.pad,
				state ? Color.LIGHT_GREEN : Color.LIGHT_RED,
			);
		}
	}
}
