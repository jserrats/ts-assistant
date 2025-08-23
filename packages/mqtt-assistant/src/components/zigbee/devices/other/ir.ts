import { StatelessZigbeeDevice } from "../../zigbee.js";
import { exposes } from "../../exposes/index.js";

/**
 * Tuya iH-F8260
 * Universal smart IR remote control
 *
 * https://www.zigbee2mqtt.io/devices/iH-F8260.html#tuya-ih-f8260
 */

export class IriHF8260 extends StatelessZigbeeDevice{
    private setTopic = `${this.topic}/set`;
    learnIrCode = new exposes.ExposesLearnIrCode(this);
    learnedIrCode = new exposes.ExposesLearnedIrCode(this);

    sendIrCode(irCode: string): void {
        this.client.publish(
            this.setTopic,
            JSON.stringify({
                ir_code_to_send: irCode,
            }),
        );
    }

    setLearnIrCode(order: boolean) {
			this.client.publish(
				this.setTopic,
				JSON.stringify({
					"learn_ir_code": order ? "ON" : "OFF"
				}),
			);
	}
}