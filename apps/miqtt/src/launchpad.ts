const midi = require("@julusian/midi");
import { telegram } from "@ts-assistant/mqtt-assistant"

export class Launchpad {
	private output = new midi.Output();
	private input = new midi.Input();
	private callbacks: Record<number, Array<(...rest: any[]) => void>> = {};
	private firstPortcount: number;

	constructor() {
		this.output.openPort(2);
		this.input.openPort(2);

		this.firstPortcount = this.output.getPortCount();
		console.log(this.firstPortcount);
		setInterval(() => {
			if (this.firstPortcount !== this.output.getPortCount()) {
				telegram.log("Launchpad disconnected", "warning");
				process.exit(1);
			}
		}, 1000);

		this.input.ignoreTypes(false, false, false);

		this.input.on("message", (deltaTime: number, message: Array<number>) => {
			console.log(`m: ${message} d: ${deltaTime}`);
			this.routeInput(message[1], message[2] === 127);
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

	public addCallback(pad: PadXY, callback: (state?: boolean) => void) {
		if (typeof this.callbacks[this.translate(pad)] === "undefined") {
			this.callbacks[this.translate(pad)] = [callback];
		} else {
			this.callbacks[this.translate(pad)].push(callback);
		}
	}

	public clearCallbacks(pad: PadXY) {
		delete this.callbacks[this.translate(pad)];
	}

	private routeInput(padN: number, pressed: boolean) {
		if (this.callbacks[padN] !== undefined) {
			this.callbacks[padN].forEach((callback) => {
				callback(pressed);
			});
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
