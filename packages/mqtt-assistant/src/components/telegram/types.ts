export type TelegramMessage = {
	title?: string;
	message: string;
	recipient?: TelegramRecipients;
};

export type LogLevel = "debug" | "info" | "warning" | "error" | "alarm";

export type TelegramRecipients = "admin" | "home" | "user";
