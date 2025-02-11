import {Logger} from "../logging/logger";

export declare global {
    declare namespace globalThis {
        var logger: Logger;
    }
}