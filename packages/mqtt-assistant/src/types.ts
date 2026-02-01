import mqtt from "mqtt";
import { Message } from "./router.js";
export type Trigger = {
	topic: string;
	payload: string;
};

export type Automation = {
	trigger: Trigger;
	callback: Callback;
};

export type AutomationMultipleTriggers = {
	trigger: Trigger[];
	callback: Callback;
};

type Callback = (args: Message, packet?: mqtt.IPublishPacket) => void;