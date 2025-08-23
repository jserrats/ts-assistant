import { client } from "../../../../../mqtt.js";
import { router } from "../../../../../router.js";
import { ESPHOME_TOPIC } from "../../../../../topics.js";
import { LightESPHome } from "../light.js";

jest.mock("../../../../../mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {}),
	},
}));

describe("LightESPHome", () => {
	let lightEsphome: LightESPHome;

	beforeAll(async () => {
		lightEsphome = new LightESPHome("test1", "test1");
	});

	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should update status", async () => {
		const mockCallbackTrue = jest.fn();
		const mockCallbackFalse = jest.fn();

		lightEsphome.on(lightEsphome.events.state, (state) => {
			if (state) {
				mockCallbackTrue();
			} else {
				mockCallbackFalse();
			}
		});

		expect(lightEsphome.state).toBe(undefined);

		router.route(`${ESPHOME_TOPIC}/test1/light/test1/state`, '{"state":"ON"}');
		expect(lightEsphome.state).toBeTruthy();
		expect(mockCallbackTrue).toHaveBeenCalled();

		router.route(`${ESPHOME_TOPIC}/test1/light/test1/state`, '{"state":"OFF"}');
		expect(lightEsphome.state).toBe(false);
		expect(mockCallbackFalse).toHaveBeenCalled();
	});

	it("should turn on/off", async () => {
		lightEsphome.setOn();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			lightEsphome.commandTopic,
			'{"state":"ON"}',
		]);
	});

	it("should toggle", async () => {
		lightEsphome.toggle();
		expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
			lightEsphome.commandTopic,
			'{"state":"TOGGLE"}',
		]);
	});
});
