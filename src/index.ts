// noinspection JSIgnoredPromiseFromCall
import {Request, Response} from "express";
import dotenv from "dotenv";
import {formatDate} from "./functions";
import {Telegram} from "./telegram";
import {ConsoleLogger} from "./logging/logger";
import {WebServer} from "./webserver";

dotenv.config({path: "../.env"});

const telegram: Telegram = new Telegram(process.env.TOKEN || "", process.env.CHAT || "");
const webserver: WebServer = new WebServer(process.env.PORT || 4200)

let MAX_TIMEOUT = ((process.env.MAX_TIMEOUT as unknown as number) || 15);
let LAST_CHECK_IN: number|null = null;
let ALERTED = false;

let logger = new ConsoleLogger();

async function sendAlert(): Promise<void>
{
    if (LAST_CHECK_IN === null) {
        logger.debug("Server hasn't called home before, skipping...")
        return;
    }
    if (LAST_CHECK_IN < Date.now() - (MAX_TIMEOUT * 60 * 1000)) {
        logger.debug("Server called home recently, skipping...")
        return;
    }
    if (ALERTED) {
        logger.debug("Recently ALERTED, skipping...");
        return;
    }
    ALERTED = true;
    logger.debug("Sending alert");
    await telegram.send("It's been " + MAX_TIMEOUT + " minutes since last check in");
}

function callHome(request: Request, response: Response) {
    ALERTED = false;
    LAST_CHECK_IN = Date.now();
    logger.debug('Server Called Home At: ' + formatDate(new Date(LAST_CHECK_IN)));

    response.setHeader("Content-Type", "application/json");
    response.send(JSON.stringify({success: true,}));
}

function initialize() {
    try {
        telegram.command("last", (ctx) => {
            if (LAST_CHECK_IN === null) {
                ctx.reply("Server has not checked in");
            } else {
                ctx.reply("Server Last Checked In At " + formatDate(new Date(LAST_CHECK_IN)));
            }
        });

        telegram.init(async () => {
            setInterval(sendAlert, MAX_TIMEOUT * 60 * 1000);
            logger.info("Telegram Bot Launched Successfully");
        });

        webserver.get("/call-home", callHome);

        webserver.start(() => {
            logger.info(`Webserver Launched Successfully`);
        });
    } catch (e) {
        console.error(e);
    }
}

initialize();