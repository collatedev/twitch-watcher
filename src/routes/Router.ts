import * as Express from "express"
import IRouter from "./IRouter";
import * as Path from "path";
import ErrorMessage from "../messages/ErrorMessage";
import DataMessage from "../messages/DataMessage";

const RootPath = '/api/v1/';

export default abstract class Router implements IRouter {
    protected router : Express.Router;
    private basePath : string;

    constructor(path: string) {
        this.basePath = path;
        this.router = Express.Router();
    }

    public getPath(): string {
        return Path.join(RootPath, this.basePath)
    }

    public getRouter(): Express.Router {
        return this.router;
    }

    protected sendError(response: Express.Response, message: string, status: number) {
        response
            .json(new ErrorMessage(message))
            .status(status);
    }

    protected sendData(response: Express.Response, data: object, status: number) {
        response
            .json(new DataMessage(data))
            .status(status);
    }
    
    public abstract setup(): void;
}