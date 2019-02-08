import * as Express from "express"
import IRouter from "./IRouter";
import * as Path from "path";

const ExpressRouter: Express.Router = Express.Router();
const RootPath = '/api/v1/';

export default abstract class Router implements IRouter {
    protected router = ExpressRouter;
    private basePath : string;

    constructor(path) {
        this.basePath = path;
    }

    public getPath() {
        return Path.join(RootPath, this.basePath)
    }

    public getRouter() {
        return ExpressRouter;
    }
    
    public abstract setup();
}