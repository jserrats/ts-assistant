import type { interfaces } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import type { Adapter } from "./adapter";

export class SensorAdapter implements Adapter {
    component: interfaces.NumericSensor;
    pad: PadXY;
    launchpad: Launchpad;

    constructor(
        component: interfaces.NumericSensor,
        launchpad: Launchpad,
        padXY: PadXY,
    ) {
        this.component = component;
        this.pad = padXY;
        this.launchpad = launchpad;
        this.updatePadColor();
        this.launchpad.addCallback(this.pad, {
            click: () => {
                this.launchpad.textModeOn(this.component.toString() ?? "N/A");
            }
        });
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
                Color.PINK
            );
        }
    }
}
