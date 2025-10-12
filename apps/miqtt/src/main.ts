// import { assistant, esphome, zigbee } from "@ts-assistant/mqtt-assistant";
// import { BinarySensorAdapter } from "./adapters/binary-sensor";
// import {
// 	TemperatureLightZigbeeAdapter,
// 	ZigbeeLightAdapter
// } from "./adapters/light";

// import { ButtonAdapter } from "./adapters/button";
// import { PublishMqttAdapter } from "./adapters/publish";
// import { SwitchAdapter } from "./adapters/switch";

import {
	TemperatureLightZigbeeAdapter,
	
} from "./adapters/light";
import {  zigbee } from "@ts-assistant/mqtt-assistant";

import { Launchpad } from "./launchpad";
console.log("[i] Starting miqtt");

const launchpad = new Launchpad();

new TemperatureLightZigbeeAdapter(
	new zigbee.lights.LED1623G12("studio_light"),
	launchpad,
	{ x: 0, y: 0 },
);

// // studio
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED1623G12("studio_light"),
// 	launchpad,
// 	{ x: 0, y: 0 },
// );
// new SwitchAdapter(new zigbee.switches.E1603("workshop_power"), launchpad, {
// 	x: 1,
// 	y: 0,
// });
// new SwitchAdapter(new zigbee.switches.E1603("studio_fan"), launchpad, {
// 	x: 2,
// 	y: 0,
// });
// new SwitchAdapter(new zigbee.switches.E1603("3dprinter"), launchpad, {
// 	x: 3,
// 	y: 0,
// });
// new SwitchAdapter(new zigbee.switches.E1603("desk_power"), launchpad, {
// 	x: 4,
// 	y: 0,
// });
// new ZigbeeLightAdapter(
// 	new zigbee.lights.YSR_MINI_01_dimmer("studio_shelf_light"),
// 	launchpad,
// 	{ x: 5, y: 0 },
// );
// new BinarySensorAdapter(
// 	new zigbee.sensors.closure.TS0203("studio_window_closure_sensor").contact,
// 	launchpad,
// 	{ x: 7, y: 0 },
// );

// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.GL_C_006P("desktop_backlighting"),
// 	launchpad,
// 	{ x: 2, y: 1 },
// );
// new SwitchAdapter(new zigbee.switches.E1603("desktop_light"), launchpad, {
// 	x: 3,
// 	y: 1,
// });
// new PublishMqttAdapter(
// 	launchpad,
// 	{ topic: "homeassistant/custom/spotify", payload: "play" },
// 	{ x: 4, y: 1 },
// );
// new PublishMqttAdapter(
// 	launchpad,
// 	{ topic: "homeassistant/custom/spotify", payload: "next" },
// 	{ x: 5, y: 1 },
// );

// new ButtonAdapter(
// 	launchpad,
// 	new esphome.ButtonESPHome("standing-desk", "stand"),
// 	{ x: 2, y: 2 },
// );
// new ButtonAdapter(
// 	launchpad,
// 	new esphome.ButtonESPHome("standing-desk", "sit"),
// 	{ x: 3, y: 2 },
// );
// new SwitchAdapter(
// 	new zigbee.switches.XMSJ("bluetooth_audio_input"),
// 	launchpad,
// 	{ x: 4, y: 2 },
// );
// new SwitchAdapter(new zigbee.switches.XMSJ("wireless_charger"), launchpad, {
// 	x: 5,
// 	y: 2,
// });

// // music
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED2101G4("mood_music_light"),
// 	launchpad,
// 	{ x: 0, y: 1 },
// );
// new BinarySensorAdapter(
// 	new zigbee.sensors.closure.TS0203("music_window_closure_sensor").contact,
// 	launchpad,
// 	{ x: 7, y: 1 },
// );

// // laundry
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED1623G12("laundry_light"),
// 	launchpad,
// 	{ x: 0, y: 3 },
// );
// new BinarySensorAdapter(
// 	new zigbee.sensors.presence.IH012_RT01("laundry_presence").occupancy,
// 	launchpad,
// 	{ x: 7, y: 3 },
// );

// // lobby
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED1623G12("lobby_light"),
// 	launchpad,
// 	{ x: 0, y: 4 },
// );
// new BinarySensorAdapter(
// 	new zigbee.sensors.closure.TS0203("door_closure_sensor", true).contact,
// 	launchpad,
// 	{ x: 6, y: 4 },
// );
// new BinarySensorAdapter(
// 	new esphome.BinarySensorESPHome("lobby", "main_door"),
// 	launchpad,
// 	{ x: 7, y: 4 },
// );

// // kitchen
// new SwitchAdapter(
// 	new esphome.SwitchESPHome("sandwich", "sandwich"),
// 	launchpad,
// 	{ x: 0, y: 5 },
// );
// new BinarySensorAdapter(
// 	new assistant.BinaryMQTTSensor("airfryer_binary"),
// 	launchpad,
// 	{ x: 7, y: 5 },
// );
// new PublishMqttAdapter(
// 	launchpad,
// 	{ topic: "homeassistant/custom/clean/kitchen", payload: "" },
// 	{ x: 1, y: 5 },
// );

// // living room
// new SwitchAdapter(
// 	new zigbee.switches.E1603("livingroom_smooth_lights"),
// 	launchpad,
// 	{ x: 0, y: 6 },
// );
// new SwitchAdapter(new esphome.LightESPHome("minimatrix", "clock"), launchpad, {
// 	x: 1,
// 	y: 6,
// });

// // bedroom
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED1623G12("bedroom_left_light"),
// 	launchpad,
// 	{ x: 0, y: 7 },
// );
// new TemperatureLightZigbeeAdapter(
// 	new zigbee.lights.LED1623G12("bedroom_right_light"),
// 	launchpad,
// 	{ x: 1, y: 7 },
// );
// new SwitchAdapter(new zigbee.switches.E1603("bedroom_fan"), launchpad, {
// 	x: 2,
// 	y: 7,
// });
// new SwitchAdapter(new zigbee.switches.E1603("mosquito_power"), launchpad, {
// 	x: 3,
// 	y: 7,
// });
// new SwitchAdapter(
// 	new esphome.LightESPHome("bedroom", "nightstand_led"),
// 	launchpad,
// 	{ x: 4, y: 7 },
// );
// new SwitchAdapter(new zigbee.switches.XMSJ("bedroom_mood_light"), launchpad, {
// 	x: 5,
// 	y: 7,
// });
