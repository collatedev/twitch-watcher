import * as Express from "express"
import IRouter from "./IRouter";
import * as Path from "path";

const ExpressRouter: Express.Router = Express.Router();
const RootPath = '/api/v1/';

export default abstract class Router implements IRouter {
    protected router : Express.Router = ExpressRouter;
    private basePath : string;

    constructor(path: string) {
        this.basePath = path;
    }

    public getPath(): string {
        return Path.join(RootPath, this.basePath)
    }

    public getRouter(): Express.Router {
        return ExpressRouter;
    }
    
    public abstract setup(): void;
}