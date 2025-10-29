import { initMqtt } from "./mqtt";
import { Outbound } from "./outbound";

const outbound = new Outbound();
initMqtt(outbound);