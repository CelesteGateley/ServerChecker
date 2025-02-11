// noinspection JSIgnoredPromiseFromCall

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Context, Telegraf } from "telegraf";
import {ConsoleLogger} from "./logging/logger";
import {formatDate} from "./functions";

dotenv.config({path: "../.env"});

const app: Express = express();
const port = process.env.PORT || 4200;

const token: string = process.env.TOKEN || "";
const chat: string = process.env.CHAT || "";
const bot: Telegraf = new Telegraf(token);

global.MAX_TIMEOUT = ((process.env.MAX_TIMEOUT as unknown as number) || 15);

global.LAST_CHECK_IN = null;
global.ALERTED = false;

const logger = new ConsoleLogger();

async function sendAlert(): Promise<void>
{
    if (global.ALERTED) {
        logger.info("Recently global.ALERTED, skipping...");
        return;
    }
    global.ALERTED = true;
    logger.info("Sending alert");
    await bot.telegram.sendMessage(chat, "It's been " + global.MAX_TIMEOUT + " minutes since last check in");
}

async function calledHome(): Promise<void>
{
    global.ALERTED = false;
    global.LAST_CHECK_IN = Date.now();
    logger.info('Server Called Home At: ' + formatDate(new Date(global.LAST_CHECK_IN)));
}

app.get("/call-home", (req: Request, res: Response) => {
    calledHome();
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({success: true,}));
});

if (!token || !chat) {
    logger.fatal("Token or chat not set");
} else {
    bot.command("last", (ctx: Context) => {
        if (global.LAST_CHECK_IN === null) {
            ctx.reply("Server has not checked in");
        } else {
            ctx.reply("Server Last Checked In At " + formatDate(new Date(global.LAST_CHECK_IN)));
        }
    })

    bot.launch(async () => {
        setInterval(async () => {
            if (global.LAST_CHECK_IN === null || global.LAST_CHECK_IN < Date.now() - (global.MAX_TIMEOUT * 60 * 1000)) {
                return;
            }
            await sendAlert();
        }, global.MAX_TIMEOUT * 60 * 1000);
        logger.log("Server Launched Successfully");
    });

    app.listen(port, () => {
        logger.log(`Listening on port ${port}`);
    });

    //process.once('SIGINT', () => bot.stop('SIGINT'));
    //process.once('SIGTERM', () => bot.stop('SIGTERM'));
}



