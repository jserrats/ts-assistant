import type { LogLevel, TelegramMessage } from "./types.js";
import { client } from "../../mqtt.js";
import { hostname } from "os";
import { TELEGRAM_OUTBOUND_TOPIC } from "../../topics.js";

export class Telegram {
	static base_topic = TELEGRAM_OUTBOUND_TOPIC;

	/**
	 * @deprecated Use log() method instead as it provides more features and proper formatting
	 * Basic method for sending error messages without formatting
	 * @param string to be logged on telegram
	 */
	send(message: string) {
		client.publish(Telegram.base_topic, message);
	}

	log(message: TelegramMessage | string, logLevel?: LogLevel) {
		let outMessage: TelegramMessage;
		if (typeof message === "string") {
			outMessage = { message: message } as TelegramMessage;
		} else {
			outMessage = message;
		}

		outMessage.message = outMessage.message.replace("(", "\\(").replace(")", "\\)");
		
		if( outMessage.title !== undefined ) {
			outMessage.title = outMessage.title.replace("(", "\\(").replace(")", "\\)");
		}

		let topic = Telegram.base_topic;
		if (logLevel !== undefined) {
			topic = `${topic}${logLevel}`;
		}
		client.publish(topic, JSON.stringify(outMessage));
	}

	debug(message: TelegramMessage | string) {
		this.log(message, "debug");
	}
	
	info(message: TelegramMessage | string) {
		this.log(message, "info");
	}

	warning(message: TelegramMessage | string) {
		this.log(message, "warning");
	}

	error(message: TelegramMessage | string | Error) {
		if (message instanceof Error) {
			this.log(
				{
					message: `Hostname: ${hostname()}`,
					title: `${message.name} \`${message.message}\``,
				} as TelegramMessage,
				"error",
			);
		} else {
			this.log(message, "error");
		}
		console.error(message);
	}

	alarm(message: TelegramMessage | string) {
		this.log(message, "alarm");
	}
}