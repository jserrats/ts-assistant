const midi = require("@julusian/midi");
import { telegram } from "@ts-assistant/mqtt-assistant"

type padConfig = {
	alreadyPressed: boolean;
	holdMode: boolean;
	callbacks: {
		click?: () => void;
		hold?: () => void;
		holdRelease?: () => void;
		faderCallback?: (heightSelected: number) => void;
		optionsCallback?: (optionSelected: number) => void;
	}
}

export class Launchpad {
	private output = new midi.Output();
	private input = new midi.Input();
	private padConfigs: Record<number, padConfig> = {};
	private firstPortcount: number;

	constructor() {
		this.output.openPort(2);
		this.input.openPort(2);

		this.firstPortcount = this.output.getPortCount();
		console.log(this.firstPortcount);
		setInterval(() => {
			if (this.firstPortcount !== this.output.getPortCount()) {
				telegram.client.warning("Launchpad disconnected");
				process.exit(1);
			}
		}, 1000);

		this.input.ignoreTypes(false, false, false);

		this.input.on("message", (deltaTime: number, message: Array<number>) => {
			console.log(`m: ${message} d: ${deltaTime}`);
			try {
				this.routeInput(message[1], message[2] === 127);

			} catch (e) {
				telegram.client.error("Error handling launchpad input: " + e);
			}
		});

		this.setProgrammerMode();
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				this.setSolidColor({ x: x, y: y }, Color.OFF);
			}
		}
	}

	private setProgrammerMode() {
		this.output.sendMessage([240, 0, 32, 41, 2, 13, 0, 127, 247]);
	}

	public setSolidColor(pad: PadXY, color: Color) {
		this.output.sendMessage([144, this.translate(pad), color]);
	}

	private translate(pad: PadXY) {
		return (pad.y + 1) * 10 + pad.x + 1;
	}

	public addCallback(pad: PadXY, callbacks: padConfig["callbacks"]) {
		// if we already have a config for this pad, merge the callbacks
		if (this.padConfigs[this.translate(pad)] !== undefined) {
			this.padConfigs[this.translate(pad)].callbacks = {
				...this.padConfigs[this.translate(pad)].callbacks,
				...callbacks,
			}
			return
		}

		this.padConfigs[this.translate(pad)] = {
			alreadyPressed: false,
			holdMode: false,
			callbacks: callbacks,
		}
	}

	private routeInput(padN: number, pressed: boolean) {
		if (padN % 10 === 9) {
			// "fader" column input
			Object.values(this.padConfigs)
				.find(cfg => cfg.holdMode === true)
				.callbacks.faderCallback(Math.trunc(padN / 10) - 1);
			return
		}

		if (padN > 89) {
			// "options" row input
			Object.values(this.padConfigs)
				.find(cfg => cfg.holdMode === true)
				.callbacks.optionsCallback(padN % 10 - 1);
			return
		}

		if (this.padConfigs[padN] !== undefined) {
			this.padConfigs[padN].alreadyPressed
			if (pressed) {
				this.padConfigs[padN].alreadyPressed = true;
				setTimeout(() => {
					if (this.padConfigs[padN].alreadyPressed) {
						this.padConfigs[padN].holdMode = true;
						this.padConfigs[padN].callbacks.hold?.();
					}
				}, 200);
			} else {
				this.padConfigs[padN].alreadyPressed = false;
				if (this.padConfigs[padN].holdMode) {
					this.padConfigs[padN].callbacks.holdRelease?.();
					this.padConfigs[padN].holdMode = false;
				} else {
					this.padConfigs[padN].callbacks.click?.()
				}
			}
		}
	}

	public faderOn(height: number) {
		for (let i = 0; i < 8; i++) {
			if (i < height) {
				this.setSolidColor({ x: 8, y: i }, Color.PINK)
			} else {
				this.setSolidColor({ x: 8, y: i }, Color.OFF)
			}
		}
	}

	public faderOff() {
		for (let i = 0; i < 8; i++) {
			this.setSolidColor({ x: 8, y: i }, Color.OFF);
		}
	}

	public optionsOn(options: Array<Color>) {
		for (let i = 0; i < options.length; i++) {
			this.setSolidColor({ x: i, y: 8 }, options[i]);
		}
	}

	public optionsOff() {
		for (let i = 0; i < 8; i++) {
			this.setSolidColor({ x: i, y: 8 }, Color.OFF);
		}
	}

	public textModeOn(text: string) {
		text = text.replace("°", ".");
		const textBytes = [240, 0, 32, 41, 2, 13, 7, 0, 7, 0, 37].concat(
			Array.from(text).map(c => c.charCodeAt(0))
		).concat([247])
		console.log(textBytes, text);
		this.output.sendMessage(textBytes);
	}

	public textModeOff() {
		this.output.sendMessage([240, 0, 32, 41, 2, 13, 7, 247]);
	}
}

export type PadXY = {
	x: number;
	y: number;
};

export enum Color {
	WHITE = 3,
	WARM_WHITE = 108,
	PINK = 53,
	RED = 120,
	BLUE = 45,
	GREEN = 21,
	OFF = 0,
	ORANGE = 9,
	PURPLE = 49,
	LIGHT_GREEN = 25,
	LIGHT_RED = 60,
	STATE_ON = GREEN,
	STATE_OFF = RED,
	STATE_UNDEFINED = BLUE,
}
