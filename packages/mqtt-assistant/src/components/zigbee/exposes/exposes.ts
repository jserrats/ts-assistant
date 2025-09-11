import { ZigbeeDevice } from "../zigbee.js";
import {
	ExposesBoolean,
	ExposesNumber,
	ExposesSeteableNumber,
	ExposesString,
} from "./base.js";

export class ExposesSwitch extends ExposesBoolean {
	static override exposes = "state";

	override _updateExposes(message: Record<string, string>, exposeName?: string): boolean {
		let tmp: boolean;
		if (exposeName == undefined) {
			exposeName = ExposesSwitch.exposes; //state
		}

		if (message[exposeName] !== undefined) {
			tmp = message[exposeName] === "ON";

			if (this.state === undefined || tmp !== this.state) {
				this.state = tmp;
			}
		}
		return this.state;
	}
}

export class ExposesAction extends ExposesString {
	static override exposes = "action";
}

export class ExposesLinkQuality extends ExposesNumber {
	static override exposes = "linkquality";
	public override unit = "LQI";
}

export class ExposesBrightness extends ExposesSeteableNumber {
	static override exposes = "brightness";
	static unit = "%";
}

export class ExposesColorTemperature extends ExposesSeteableNumber {
	static override exposes = "color_temp";
}

export class ExposesTemperature extends ExposesNumber {
	static override exposes = "temperature";
	public override unit = "°C";
}

export class ExposesHumidity extends ExposesNumber {
	static override exposes = "humidity";
	public override unit = "%";
}

export class ExposesCurrent extends ExposesNumber {
	static override exposes = "current";
	public override unit = "A";
}

export class ExposesPower extends ExposesNumber {
	static override exposes = "power";
	public override unit = "W";
}

export class ExposesVoltage extends ExposesNumber {
	static override exposes = "voltage";
	public override unit = "V";
}

export class ExposesOccupancy extends ExposesBoolean {
	static override exposes = "occupancy";
}

export class ExposesVibration extends ExposesBoolean {
	static override exposes = "vibration";
}

export class ExposesContact extends ExposesBoolean {
	static override exposes = "contact";
	private inverted = false;

	constructor(parentDevice: ZigbeeDevice, inverted?: boolean) {
		super(parentDevice);
		if (inverted !== undefined) {
			this.inverted = inverted;
		}
	}

	override _updateExposes(message: Record<string, boolean>): void {
		let tmp: boolean;
		if (this.inverted) {
			tmp = !message[ExposesContact.exposes];
		} else {
			tmp = message[ExposesContact.exposes];
		}
		super._updateExposes({ contact: tmp });
	}
}

export class ExposesLearnIrCode extends ExposesSwitch {
	static override exposes = "learn_ir_code";

	override _updateExposes(message: Record<string,string>): boolean {
		return super._updateExposes(message, ExposesLearnIrCode.exposes);
	}
}

export class ExposesIrCodeToSend extends ExposesString {
	static override exposes = "ir_code_to_send";
}

export class ExposesLearnedIrCode extends ExposesString {
	static override exposes = "learned_ir_code";
}