import { router } from "../../../router.js";
import { BASE_TOPIC } from "../../../topics.js";
import { TextMQTTSensor } from "../text-sensor.js";

jest.mock("../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("TextMQTTSensor", () => {
	it("should update state correctly", async () => {
		const sensor = new TextMQTTSensor("test");
		expect(sensor.state).toBeUndefined();
		router.route(`${BASE_TOPIC}test`, "asdf");
		expect(sensor.state).toStrictEqual("asdf");
		router.route(`${BASE_TOPIC}test`, "ghjk");
		expect(sensor.state).toStrictEqual("ghjk");

	});

	it("should emit the correct states", async () => {
		const sensor = new TextMQTTSensor("test3");
		const mockCallback = jest.fn((callback) => {});

		expect(sensor.state).toBeUndefined();

		sensor.on(sensor.events.state, mockCallback);
		router.route(`${BASE_TOPIC}test3`, "asdf");
		expect(sensor.state).toStrictEqual("asdf");
		expect(mockCallback).toHaveBeenCalled();

	});
});
