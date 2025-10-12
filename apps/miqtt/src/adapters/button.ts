import { esphome } from "@ts-assistant/mqtt-assistant";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import { Adapter } from "./adapter";

export class ButtonAdapter implements Adapter {
    pad: PadXY;
    launchpad: Launchpad;
    component: esphome.ButtonESPHome;

    constructor(
        launchpad: Launchpad,
        button: esphome.ButtonESPHome,
        padXY: PadXY,
    ) {
        this.pad = padXY;
        this.launchpad = launchpad;
        launchpad.addCallback(padXY, {
            click: () => {
                button.press();
            }
        });
        this.launchpad.setSolidColor(this.pad, Color.WHITE);
    }
}
