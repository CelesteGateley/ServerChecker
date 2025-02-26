import {formatDate} from "./functions";

export class Manager {
    private readonly timeout: number;
    private lastCheckIn: number|null = null;
    private alerted = false;

    constructor(timeout = 15) {
        this.timeout = timeout * 60 * 1000;
    }

    /**
     * Returns whether an alert should be sent out by the system, and if so, updates that an alert has been sent
     *
     * @returns boolean Whether the alert was sent
     */
    alert(): boolean {
        if (this.lastCheckIn === null) {
            logger.debug("Server hasn't called home before, skipping...")
            return false;
        }
        if (this.alerted) {
            logger.debug("Recently alerted, skipping...");
            return false;
        }
        if ((this.lastCheckIn > Date.now() - this.timeout)) {
            logger.debug("Server called home recently, skipping...")
            return false;
        }
        this.alerted = true;
        return true;
    }

    /**
     * Updates the manager that a check in has occurred
     */
    checkIn(): void
    {
        this.lastCheckIn = Date.now();
        this.alerted = false;
        logger.debug('Server Called Home At: ' + formatDate(new Date(this.lastCheckIn)));
    }

    /**
     * When was the last time the server checked in
     *
     * @returns string|null Returns a string version of the check in, or null if it's not set
     */
    getLastCheckInDate(): string|null {
        if (this.lastCheckIn === null || this.lastCheckIn === undefined) {
            return null;
        }
        return formatDate(new Date(this.lastCheckIn));
    }
}