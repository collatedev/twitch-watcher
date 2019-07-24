import Express from "express";
import * as BodyParser from "body-parser";
import IRouter from "./routes/IRouter";
import morgan from "morgan";
import { ILogger } from "@collate/logging";

export default class App {
    public app: Express.Application;
    private logger : ILogger;

    constructor(logger : ILogger) {
        this.app = Express();
        this.logger = logger;
    }

    public initialize() : void {
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({
            extended: false
        }));
        
        const streamOptions : morgan.StreamOptions = {
            write: (message: string): void => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                this.logger.info(message);
            },
        };

        this.app.use(morgan('combined', { stream: streamOptions }));
    }

    public start(port: number) : void {
        this.app.listen(port, () : void => {
            this.logger.info(`Server is listening on port ${port}`);
        });
    }

    public addRouter(router: IRouter) : void {
        router.setup();
        this.app.use(router.getPath(), router.getRouter());
    }
}