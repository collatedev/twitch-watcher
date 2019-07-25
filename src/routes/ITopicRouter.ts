import { Request, Response } from "express";
import { IRouter } from "@collate/router";

export default interface ITopicRouter extends IRouter {
    handleChallenge(request: Request, response: Response) : Promise<void>;
    handleWebhookCall(request: Request, response: Response) : Promise<void>;
}