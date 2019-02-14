import * as Express from "express"
import * as BodyParser from "body-parser"
import IRouter from "./routes/IRouter";
import * as morgan from "morgan";
import {Stream, Logger} from "./config/Winston";

export default class App {
    public app: Express.Application

    constructor() {
        this.app = Express();
    }

    public initialize() {
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({
            extended: false
        }));
        
        this.app.use(morgan('combined', { stream: Stream }));
        
        this.app.use((request: any, response: any) => {
            console.log("send request to http logging service");
        });
    }

    public start(port: number) {
        this.app.listen(port, () => {
            Logger.info(`Server is listening on port ${port}`);
        });
    }

    public addRouter(router: IRouter) {
        router.setup();
        this.app.use(router.getPath(), router.getRouter());
    }
}