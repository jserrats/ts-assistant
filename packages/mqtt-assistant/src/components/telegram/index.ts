import { Telegram } from "./client.js";
export type { TelegramMessage, LogLevel, TelegramRecipients } from "./types.js";

export const client = new Telegram();