import {formatDate} from "./functions";

export class Manager {
    private timeout;
    private lastCheckIn: number|null = null;
    private alerted = false;

    constructor(timeout = 15) {
        this.timeout = timeout * 60 * 1000;
    }

    shouldAlert() {
        return !this.alerted && this.lastCheckIn !== null && (this.lastCheckIn < Date.now() - this.timeout);
    }

    alert(): boolean {
        if (this.lastCheckIn === null) {
            logger.debug("Server hasn't called home before, skipping...")
            return false;
        }
        if (this.alerted) {
            logger.debug("Recently alerted, skipping...");
            return false;
        }
        if (this.shouldAlert()) {
            logger.debug("Server called home recently, skipping...")
            return false;
        }
        this.alerted = true;
        return true;
    }

    checkIn(): void
    {
        this.lastCheckIn = Date.now();
        this.alerted = false;
        logger.debug('Server Called Home At: ' + formatDate(new Date(this.lastCheckIn)));
    }

    getLastCheckInDate(): string|null {
        if (this.lastCheckIn === null || this.lastCheckIn === undefined) {
            return null;
        }
        return formatDate(new Date(this.lastCheckIn));
    }
}