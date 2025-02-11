export declare global {
    declare namespace globalThis {
        let MAX_TIMEOUT: number;
        let LAST_CHECK_IN: number|null;
        let ALERTED: boolean;
    }
}