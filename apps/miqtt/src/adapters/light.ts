import { interfaces } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import type { Adapter } from "./adapter";

export class ZigbeeLightAdapter implements Adapter {
	component: interfaces.BrightLight;
	pad: PadXY;
	launchpad: Launchpad;
	pressed = false;
	altMode = false;

	constructor(
		component: interfaces.BrightLight,
		launchpad: Launchpad,
		padXY: PadXY,
	) {
		this.component = component;
		this.pad = padXY;
		this.launchpad = launchpad;
		launchpad.addCallback(padXY, {
			click: () => { this.component.toggle() },
			hold: () => { this.enterHoldMode() },
			holdRelease: () => { this.exitHoldMode() },
			faderCallback: (heightSelected: number) => { 
				this.component.setOn({ brightness: heightBrightness[heightSelected] });
				this.launchpad.faderOn(heightSelected + 1);
			},
		});
		
		this.updatePadColor(component.state);
		this.component.on(this.component.events.state, (state: boolean) => {
			this.updatePadColor(state);
		});
	}

	protected enterHoldMode() {
		this.launchpad.faderOn(Math.ceil(this.component.brightness.state / 32));
	}

	protected exitHoldMode() {
		this.launchpad.faderOff();
		this.launchpad.optionsOff();
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

export class TemperatureLightZigbeeAdapter extends ZigbeeLightAdapter {
	declare component: interfaces.TemperatureLight;

	constructor(
		component: interfaces.TemperatureLight,
		launchpad: Launchpad,
		padXY: PadXY,
	) {
		super(component, launchpad, padXY);
		this.component = component;
	}

	protected override enterHoldMode() {
		super.enterHoldMode();
		this.launchpad.optionsOn([Color.WARM_WHITE, Color.WHITE]);
	}
	protected override exitHoldMode() {
		super.exitHoldMode();
		this.launchpad.optionsOff();
	}
}

const heightBrightness = [2, 36, 72, 109, 145, 182, 218, 254];
