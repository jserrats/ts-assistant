import type { Launchpad, PadXY } from "../launchpad";

export interface Adapter {
	component: any;
	pad: PadXY;
	launchpad: Launchpad;
}
