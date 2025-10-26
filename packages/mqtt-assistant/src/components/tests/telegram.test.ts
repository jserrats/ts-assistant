import { client } from "../../mqtt.js";
import { router } from "../../router.js";
import { client as telegram } from "../telegram/index.js";
import type { TelegramMessage } from "../telegram/types.js";
import { TELEGRAM_OUTBOUND_TOPIC } from "../../topics.js";

jest.mock("../../../src/mqtt", () => ({
	client: {
		publish: jest.fn((newTopic: string, newPayload: string) => {
			router.route(newTopic, newPayload);
		}),
	},
}));

describe("Telegram", () => {
	afterEach(async () => {
		(client.publish as jest.Mock).mockClear();
	});

	it("should send a message", async () => {
		telegram.send("test");
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${TELEGRAM_OUTBOUND_TOPIC}`,
		);
		expect((client.publish as jest.Mock).mock.calls[0][1]).toStrictEqual(
			"test",
		);

		telegram.log("test");
		expect(
			JSON.parse((client.publish as jest.Mock).mock.calls[1][1]),
		).toStrictEqual({ message: "test" });
	});

	it("should send an error message", async () => {
		telegram.error(new EvalError("test error"));
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${TELEGRAM_OUTBOUND_TOPIC}error`,
		);
	});

	it("should send a message with log level", async () => {
		telegram.log({ message: "test" }, "debug");
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${TELEGRAM_OUTBOUND_TOPIC}debug`,
		);

		const inbound = JSON.parse(
			(client.publish as jest.Mock).mock.calls[0][1],
		) as TelegramMessage;

		expect(inbound.message === "test").toBeTruthy();
	});

	it("should send a message with recipient option", async () => {
		telegram.log({ message: "test1", recipient: "broadcast" });
		expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
			`${TELEGRAM_OUTBOUND_TOPIC}`,
		);

		const inbound = JSON.parse(
			(client.publish as jest.Mock).mock.calls[0][1],
		) as TelegramMessage;

		expect(inbound.message === "test1").toBeTruthy();
		expect(inbound.recipient === "broadcast").toBeTruthy();
	});
});
