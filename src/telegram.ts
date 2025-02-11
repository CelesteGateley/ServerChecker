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

    /**
     * Launches the bot, passing through the callback once launched
     *
     * @param callback The callback to run once the bot is launched
     */
    init(callback: () => void = () => {}) {
        this.bot.launch(callback);
    }

    /**
     * Sends a message to the designated chat
     *
     * @param message Message to send to the chat
     */
    async send(message: string) {
        await this.bot.telegram.sendMessage(this.chat, message);
    }

    /**
     * Registers a command with the bot
     *
     * @param command The name of the command (should not include /)
     * @param callback The callback to run when the command is run
     */
    command(command: string, callback: (ctx: Context) => void) {
        this.bot.command(command, callback);
    }
}