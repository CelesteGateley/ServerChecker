// noinspection JSIgnoredPromiseFromCall

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Context, Telegraf } from "telegraf";
import dayjs from "dayjs";
import {ConsoleLogger} from "./logging/logger";

dotenv.config({path: "../.env"});

const app: Express = express();
const port = process.env.PORT || 4200;

const token: string = process.env.TOKEN || "";
const chat: string = process.env.CHAT || "";
const bot: Telegraf = new Telegraf(token);

const maxTimeout = ((process.env.MAX_TIMEOUT as unknown as number) || 15);

let lastChecked: number|null = null;
let alerted: boolean = false;

let logger = new ConsoleLogger();


function formatDate(date: Date|null = null): string
{
    return dayjs(date || Date.now()).format("YYYY-MM-DD HH:mm:ss");
}

async function sendAlert(): Promise<void>
{
    if (alerted) {
        logger.info("Recently alerted, skipping...");
        return;
    }
    alerted = true;
    logger.info("Sending alert");
    await bot.telegram.sendMessage(chat, "It's been " + maxTimeout + " minutes since last check in");
}

async function calledHome(): Promise<void>
{
    alerted = false;
    lastChecked = Date.now();
    logger.info('Server Called Home At: ' + formatDate(new Date(lastChecked)));
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
        if (lastChecked === null) {
            ctx.reply("Server has not checked in");
        } else {
            ctx.reply("Server Last Checked In At " + formatDate(new Date(lastChecked)));
        }
    })

    bot.launch(async () => {
        setInterval(async () => {
            if (lastChecked === null || lastChecked < Date.now() - (maxTimeout * 60 * 1000)) {
                return;
            }
            await sendAlert();
        }, maxTimeout * 60 * 1000);
        logger.log("Server Launched Successfully");
    });

    app.listen(port, () => {
        logger.log(`Listening on port ${port}`);
    });

    //process.once('SIGINT', () => bot.stop('SIGINT'));
    //process.once('SIGTERM', () => bot.stop('SIGTERM'));
}



