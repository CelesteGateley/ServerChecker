import express, { Express, Request, Response } from "express";

export class WebServer {
    private port: string | number;
    private app: Express;

    constructor(port: string|number) {
        this.port = port;
        this.app = express();
    }

    /**
     * Starts the webserver
     *
     * @param callback Callback to run once the webserver has started
     */
    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }

    /**
     * Registers a get route to the web server
     *
     * @param route The route to access through
     * @param callback The callback to run when the route is requested
     */
    get(route: string, callback: (request: Request, response: Response) => void) {
        this.app.get(route, callback);
    }

    /**
     * Registers a post route to the web server
     *
     * @param route The route to access through
     * @param callback The callback to run when the route is requested
     */
    post(route: string, callback: (request: Request, response: Response) => void) {
        this.app.post(route, callback);
    }
}