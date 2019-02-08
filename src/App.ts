import * as Express from "express"
import * as BodyParser from "body-parser"
import { Router } from "express-serve-static-core";
import IRouter from "./routes/IRouter";

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
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    }

    public addRouter(router: IRouter) {
        router.setup();
        this.app.use(router.getPath(), router.getRouter());
    }
}