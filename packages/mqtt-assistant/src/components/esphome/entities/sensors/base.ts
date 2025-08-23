import type { Stateful } from "../../../interfaces/stateful.js";
import { StatefulESPHomeDevice } from "../../esphome.js";

export class BaseESPHomeSensor<T extends boolean | string | number>
	extends StatefulESPHomeDevice<T>
	implements Stateful {}
