import { Request, Response, NextFunction } from "express";
// tslint:disable-next-line: no-duplicate-imports
import * as Express from "express";
import IRouter from "./IRouter";
import * as Path from "path";
import ErrorMessage from "../messages/ErrorMessage";
import DataMessage from "../messages/DataMessage";
import IRouteHandler from "./IRouteHandler";
import { 
    IValidationSchema, 
    IValidator, 
    Validator, 
    IRequestBuilder, 
    RequestBuilder,
    IValidationResult
} from "@collate/request-validator";
import StatusCodes from "./StatusCodes";

const RouteValidator : IValidator = new Validator();

export default abstract class Router implements IRouter {
	private readonly RootPath: string = '/api/v1';

    private router : Express.Router;
    private basePath : string;
    private requestBuilder : IRequestBuilder;

    constructor(path: string) {
        this.basePath = path;
        this.router = Express.Router();
        this.requestBuilder = new RequestBuilder();
    }

    public getPath() : string {
        return Path.join(this.RootPath, this.basePath);
    }

    public getRouter() : Express.Router {
        return this.router;
    }

    public delete(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.delete(path, this.validate(schema), handler);
    }

    public get(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.get(path, this.validate(schema), handler);
    }

    public patch(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.patch(path, this.validate(schema), handler);
    }

    public post(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.post(path, this.validate(schema), handler);
    }

    public put(path : string, handler : IRouteHandler, schema : IValidationSchema) : void {
        this.router.put(path, this.validate(schema), handler);
    }

    private validate(schema : IValidationSchema) : IRouteHandler {
        return (request : Request, response : Response, next : NextFunction | undefined) : void => {
            const requestSchema : IValidationSchema = schema;

            if (this.isEmpty(request.body)) {
                this.requestBuilder.setBody(request.body);
            } 
            if (this.isEmpty(request.cookies)) {
                this.requestBuilder.setCookies(request.cookies);
            }
            if (this.isEmpty(request.headers)) {
                this.requestBuilder.setHeaders(request.headers);
            } 
            if (this.isEmpty(request.params)) {
                this.requestBuilder.setParams(request.params);
            }
            if (this.isEmpty(request.query)) {
                this.requestBuilder.setQuery(request.query);
            } 

            const result : IValidationResult = RouteValidator.validate(this.requestBuilder.build(), requestSchema);
            if (!result.isValid()) {
                this.sendError(response, JSON.stringify(result.errors), StatusCodes.BadRequest);
            }
            if (next) {
                next();
            }
            throw new Error('Missing route handler');
        };
    }

    private isEmpty(obj : any) : boolean {
        for(const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    protected sendError(response: Express.Response, message: string, status: number) : void {
        response
            .json(new ErrorMessage(message))
            .status(status);
    }

    protected sendData(response: Express.Response, data: object, status: number) : void {
        response
            .json(new DataMessage(data))
            .status(status);
    }
    
    public abstract setup() : void;
}