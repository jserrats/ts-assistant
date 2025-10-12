export { router } from "./router.js";
export {
	zigbee,
	esphome,
	Timer,
	Sun,
	Alarm,
	telegram,
	Weather,
	assistant,
	interfaces,
} from "./components/index.js";
export { getEnvVariable } from "./environment.js";
export { globalEventManager } from "./components/component.js";
export { client as mqttClient } from "./mqtt.js";