import IRouter from "./IRouter";
import { Request, Response } from "express";

export default interface ITopicRouter extends IRouter {
    handleChallenge(request: Request, response: Response) : Promise<void>;
    handleWebhookCall(request: Request, response: Response) : Promise<void>;
}