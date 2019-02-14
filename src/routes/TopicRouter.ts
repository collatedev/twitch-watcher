import Router from "./Router"
import { Request, Response } from "express"
import BodyValidator from "../validators/BodyValidator";
import ChallengeBody from "../schemas/ChallengeBody";
import StatusCodes from "./StatusCodes";
import { Logger } from "../config/Winston";

export default abstract class TopicRouter<T> extends Router {
    private readonly WebhookCallFields : Array<string> = [
        "hub.mode", "hub.topic", "hub.lease_seconds", 
        "hub.challenge", 
    ];
    private challengeValidator: BodyValidator<ChallengeBody>;
    private hookDataValidator: BodyValidator<T>;
    private topic : string;

    constructor(topic: string, requiredFields: Array<string>) {
        super(`/topic`);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
        this.challengeValidator = new BodyValidator<ChallengeBody>(this.WebhookCallFields);
        this.hookDataValidator = new BodyValidator<T>(requiredFields);
    }

    public setup() {
        this.router.get(this.topic, this.handleChallenge);
        this.router.post(this.topic, this.handleWebhookCall);
    }

    public async handleChallenge(request: Request, response: Response) {
        let body : ChallengeBody = request.query as ChallengeBody;
        if (!this.challengeValidator.isValid(body)) {
            Logger.error('Did Twitch challenge data change? Or has Twitch Services failed?');
            return this.challengeValidator.sendError(response, body);
        }
        return response.send(body["hub.challenge"]).status(StatusCodes.OK);
    }

    public async handleWebhookCall(request: Request, response: Response) {
        let body : T = request.body as T;
        if (!this.hookDataValidator.isValid(body)) {
            Logger.error(`Did Twitch ${this.topic} data schema change? Has Twitch Services failed? Does our schema not match Twitch?`);
            return this.hookDataValidator.sendError(response, body);
        }
        
        let processedData = true;
        try {
            await this.handleWebhookData(body);
        } catch (error) {
            Logger.error(error);
            processedData = false;
        }
        
        let status = processedData ? StatusCodes.OK : StatusCodes.InternalError;
        this.sendData(response, {
            desc: `Recieved data under topic: ${this.topic}`,
            body: body,
            processedData: processedData
        }, status);
    }

    protected abstract async handleWebhookData(body: T): Promise<void>;
}