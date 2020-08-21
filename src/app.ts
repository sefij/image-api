import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import TYPES from "./types";
import { RegistrableRouter } from "./Routes/RegistrableRouter";
import container from "./inversify.config";
import errorMiddleware from "./middleware/error.middleware";



class App {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.registerRouters();
        this.initilizeErrorMiddleware();
    }
    private config(): void {
        this.app.use(bodyParser.json({limit: "20mb"}));
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    private registerRouters() {
        const routers: RegistrableRouter[] = container.getAll<RegistrableRouter>(TYPES.Router);
        routers.forEach((router) => router.register(this.app));
    }
    private initilizeErrorMiddleware() {
        this.app.use( (req, res, next) => {
            res.status(404).json();
        });
        this.app.use(errorMiddleware);
        process.on("uncaughtException", (err) => {
            // tslint:disable-next-line: no-console
            console.log(err);
        });
        process.on("unhandledRejection", (err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
            process.exit(1);
        });
    }
}
export default new App().app;