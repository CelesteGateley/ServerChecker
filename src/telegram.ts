import {Context, Telegraf} from "telegraf";

export class Telegram {
    private readonly token: string;
    private readonly chat: string;
    private bot: Telegraf<Context>;

    constructor(token: string, chat: string) {
        this.token = token;
        this.chat = chat;
        this.bot = new Telegraf(this.token);
    }

    init(callback: () => void) {
        this.bot.launch(callback);
    }

    async send(message: string) {
        await this.bot.telegram.sendMessage(this.chat, message);
    }

    command(command: string, callback: (ctx: Context) => void) {
        this.bot.command(command, callback);
    }
}