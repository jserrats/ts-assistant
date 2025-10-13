import { interfaces } from "@ts-assistant/mqtt-assistant"
import { Launchpad } from "./launchpad";

export class TextNotifier {
    textSensor: interfaces.TextSensor;
    launchpad: Launchpad;

    constructor(sensor: interfaces.TextSensor, launchpad: Launchpad) {
        this.textSensor = sensor;
        this.launchpad = launchpad;
        this.textSensor.on(this.textSensor.events.state, () => { this.launchpad.textModeOn(sensor.state) });
    }
}