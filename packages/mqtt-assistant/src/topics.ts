export var SERVICE_NAME = "undefined";

if (process.env.SERVICE_NAME !== undefined) {
	SERVICE_NAME = process.env.SERVICE_NAME;
}

export const BASE_TOPIC = "assistant/";
export const STATUS_TOPIC = `${BASE_TOPIC}${SERVICE_NAME}/status`;

export const ALARM_TOPIC = `${BASE_TOPIC}alarm/`;
export const TIMER_TOPIC = `${BASE_TOPIC}timer/`;

export const ZIGBEE2MQTT_TOPIC = "zigbee2mqtt/";
export const ESPHOME_TOPIC = "esphome/";

export const TELEGRAM_BASE_TOPIC = `telegram-bridge/`;
export const TELEGRAM_OUTBOUND_TOPIC = `${TELEGRAM_BASE_TOPIC}outbound/`;
export const TELEGRAM_INBOUND_TOPIC = `${TELEGRAM_BASE_TOPIC}inbound/`;
