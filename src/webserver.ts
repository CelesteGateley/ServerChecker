import express, { Express, Request, Response } from "express";

export class WebServer {
    private port: string | number;
    private app: Express;

    constructor(port: string|number) {
        this.port = port;
        this.app = express();
    }

    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }

    get(route: string, callback: (request: Request, response: Response) => void) {
        this.app.get(route, callback);
    }

    post(route: string, callback: (request: Request, response: Response) => void) {
        this.app.post(route, callback);
    }
}