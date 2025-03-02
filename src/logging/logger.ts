import {formatDate} from "../functions";

export abstract class Logger {
    protected level: LogLevel;
    constructor(level: LogLevel = LogLevel.DEBUG) {
        this.level = level;
    }

    log(text: object|string|null): void
    {
        this.info(text);
    }

    abstract debug(text: object|string|null): void;
    abstract info(text: object|string|null): void;
    abstract warn(text: object|string|null): void;
    abstract error(text: object|string|null): void;
    abstract fatal(text: object|string|null): void;
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
}

const consoleColors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underline: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    // Colors
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
}

export class ConsoleLogger extends Logger {

    private prefix(): object|string|null
    {
        return "[" + consoleColors.cyan + formatDate() + consoleColors.reset + "] ";
    }

    debug(text: object|string|null): void {
        if (this.level > LogLevel.DEBUG) { return; }
        console.debug(this.prefix() + consoleColors.reset + "[" + consoleColors.gray + "DEBUG" + consoleColors.reset + "] " + text + consoleColors.reset);
    }
    info(text: object|string|null): void {
        if (this.level > LogLevel.INFO) { return; }
        console.info(this.prefix() + consoleColors.reset + "[" + consoleColors.blue + "INFO" + consoleColors.reset + "] " + text + consoleColors.reset);

    }
    warn(text: object|string|null): void {
        if (this.level > LogLevel.WARN) { return; }
        console.warn(this.prefix() + consoleColors.reset + "[" + consoleColors.yellow + "WARN" + consoleColors.reset + "] " + text + consoleColors.reset);

    }
    error(text: object|string|null): void {
        if (this.level > LogLevel.ERROR) { return; }
        console.error(this.prefix() + consoleColors.reset + "[" + consoleColors.red + "ERROR" + consoleColors.reset + "]" + text + consoleColors.reset);

    }
    fatal(text: object|string|null): void {
        if (this.level > LogLevel.ERROR) { return; }
        console.error(this.prefix() + consoleColors.reset + "[" + consoleColors.red + "FATAL" + consoleColors.reset + "] " + text + consoleColors.reset);
        process.kill(process.pid, "SIGINT");
    }
}