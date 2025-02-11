export declare global {
    declare namespace globalThis {
        var MAX_TIMEOUT: number;
        var LAST_CHECK_IN: number|null;
        var ALERTED: boolean;
    }
}