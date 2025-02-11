// noinspection JSIgnoredPromiseFromCall

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {formatDate} from "./functions";
import {Telegram} from "./telegram";
import {ConsoleLogger} from "./logging/logger";

dotenv.config({path: "../.env"});

const app: Express = express();
const port = process.env.PORT || 4200;

const telegram: Telegram = new Telegram(process.env.TOKEN || "", process.env.CHAT || "");

let MAX_TIMEOUT = ((process.env.MAX_TIMEOUT as unknown as number) || 15);
let LAST_CHECK_IN: number|null = null;
let ALERTED = false;

let logger = new ConsoleLogger();

async function sendAlert(): Promise<void>
{
    if (ALERTED) {
        logger.info("Recently ALERTED, skipping...");
        return;
    }
    ALERTED = true;
    logger.info("Sending alert");
    await telegram.send("It's been " + MAX_TIMEOUT + " minutes since last check in");
}

async function calledHome(): Promise<void>
{
    ALERTED = false;
    LAST_CHECK_IN = Date.now();
    logger.info('Server Called Home At: ' + formatDate(new Date(LAST_CHECK_IN)));
}

app.get("/call-home", (req: Request, res: Response) => {
    calledHome();
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({success: true,}));
});

try {
    telegram.command("last", (ctx) => {
        if (LAST_CHECK_IN === null) {
            ctx.reply("Server has not checked in");
        } else {
            ctx.reply("Server Last Checked In At " + formatDate(new Date(LAST_CHECK_IN)));
        }
    });

    telegram.init(async () => {
        setInterval(async () => {
            if (LAST_CHECK_IN === null || LAST_CHECK_IN < Date.now() - (MAX_TIMEOUT * 60 * 1000)) {
                return;
            }
            await sendAlert();
        }, MAX_TIMEOUT * 60 * 1000);
        logger.log("Server Launched Successfully");
    });

    app.listen(port, () => {
        logger.log(`Listening on port ${port}`);
    });
} catch (e) {
    console.error(e);
}



