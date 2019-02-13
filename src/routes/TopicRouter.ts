import Router from "./Router"
import { Request, Response } from "express"
import StatusCodes from "./StatusCodes";

export default abstract class TopicRouter extends Router {
    private topic : string;

    constructor(topic: string) {
        super(`/topic`);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
    }

    public setup() {
        this.router.get(this.topic, this.handleChallenge);
        this.router.post(this.topic, this.handleWebhookCall);
    }

    public async handleChallenge(request: Request, response: Response) {

    }

    public async handleWebhookCall(request: Request, response: Response) {

    }
}