import {Logger} from "../src/logging/logger";

export declare global {
    declare namespace globalThis {
        var logger: Logger;
    }
}