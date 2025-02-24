// noinspection JSIgnoredPromiseFromCall
import {Request, Response} from "express";
import dotenv from "dotenv";
import {Telegram} from "./telegram";
import {ConsoleLogger} from "./logging/logger";
import {WebServer} from "./webserver";
import {Manager} from "./manager";
import * as fs from "node:fs";

if (fs.existsSync('.env')) {
    dotenv.config({path: ".env"});
} else if (fs.existsSync('../.env')) {
    dotenv.config({path: "../.env"});
} else {
    stop();
}

const telegram: Telegram = new Telegram(process.env.TOKEN || "", process.env.CHAT || "");
const webserver: WebServer = new WebServer(process.env.PORT || 4200)
const manager: Manager = new Manager((process.env.MAX_TIMEOUT as unknown as number) || 15);

global.logger = new ConsoleLogger();

async function sendAlert(): Promise<void>
{
    if (manager.alert()) {
        logger.debug("Sending alert");
        await telegram.send("Server has not checked in recently");
    }
}

function callHome(request: Request, response: Response) {
    manager.checkIn()

    response.setHeader("Content-Type", "application/json");
    response.send(JSON.stringify({success: true,}));
}

/**
 * Initialize the servers and setup managers
 */
function initialize() {
    try {
        telegram.command("last", (ctx) => {
            const lastCheckIn = manager.getLastCheckInDate();
            if (lastCheckIn === null) {
                ctx.reply("Server has not checked in");
            } else {
                ctx.reply("Server Last Checked In At " + lastCheckIn);
            }
        });

        telegram.init(async () => {
            setInterval(sendAlert, 60 * 1000);
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