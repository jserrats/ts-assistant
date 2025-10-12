import type { interfaces } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";

export class SwitchAdapter {
	component: interfaces.Switch;
	pad: PadXY;
	launchpad: Launchpad;

	constructor(component: interfaces.Switch, launchpad: Launchpad, padXY: PadXY) {
		this.component = component;
		this.pad = padXY;
		this.launchpad = launchpad;
		launchpad.addCallback(padXY, (pressed) => {
			if (!pressed) {
				this.component.toggle();
			}
		});
		this.updatePadColor(component.state);
		this.component.on(this.component.events.state, (state: boolean) => {
			this.updatePadColor(state);
		});
	}

	private updatePadColor(state: boolean) {
		if (state === undefined) {
			this.launchpad.setSolidColor(this.pad, Color.STATE_UNDEFINED);
		} else {
			this.launchpad.setSolidColor(
				this.pad,
				state ? Color.STATE_ON : Color.STATE_OFF,
			);
		}
	}
}
