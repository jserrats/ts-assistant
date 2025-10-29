import axios, { AxiosInstance } from 'axios';
import { telegram } from "@ts-assistant/mqtt-assistant"

export class Outbound {
    private instance: AxiosInstance;
    private recipients: Record<telegram.TelegramRecipients, string>

    constructor() {

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        if (TELEGRAM_BOT_TOKEN === undefined) {
            throw new Error("[!] Missing TELEGRAM_BOT_TOKEN")
        }

        const recipients: Record<telegram.TelegramRecipients, string> = {
            admin: process.env.TELEGRAM_ADMIN_ID as string,
            user: process.env.TELEGRAM_USER_ID as string,
            broadcast: process.env.TELEGRAM_BROADCAST_ID as string,
        };
        this.recipients = recipients;

        this.instance = axios.create({
            baseURL: 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN,
            timeout: 1000,
        });

    }

    // https://core.telegram.org/bots/api#sendmessage

    private sendMessage(message: string, options?: Options) {

        let recipientID: string;

        if (options?.recipient !== undefined) {
            recipientID = this.recipients[options.recipient]
        } else {
            recipientID = this.recipients["admin"]
        }

        this.instance.post('/sendMessage', {
            chat_id: recipientID,
            text: message,
            parse_mode: "MarkdownV2"
        }).catch((error) => {
            console.error("[!] Telegram sendMessage error:", error.message, error.response?.data);
        });

    }


    static icons = {
        "debug": "🧪",
        "info": "ℹ️",
        "warning": "⚠️",
        "error": "🔴",
        "alarm": "🚨"
    }


    public handle(topic: string, message: string) {

        try {
            const logLevel = topic.split('/').pop() as telegram.LogLevel
            const messageObject = JSON.parse(message) as telegram.TelegramMessage
            let text = `${Outbound.icons[logLevel]} *${logLevel.toUpperCase()}:* `

            if (messageObject.title !== undefined) {
                text = `${text}*${messageObject.title}*\n`
            }
            text = text + messageObject.message
            this.sendMessage(text, { recipient: messageObject.recipient })
        } catch {
            this.sendMessage(message)
        }
    }
}

type Options = {
    recipient?: telegram.TelegramRecipients
}