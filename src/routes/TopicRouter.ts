import Router from "./Router"
import { Request, Response } from "express"
import PartialQueryValidator from "../validators/PartialQueryValidator";
import ChallengeQuery from "../schemas/request/ChallengeQuery";
import StatusCodes from "./StatusCodes";
import { Logger } from "../config/Winston";
import IValidatable from "../validators/IValidatable";
import PartialBodyValidator from "../validators/PartialBodyValidator";
import QueryValidator from "../validators/QueryValidator";

export default abstract class TopicRouter<T extends IValidatable> extends Router {
    private challengeValidator: QueryValidator<ChallengeQuery>;
    private hookDataValidator: PartialBodyValidator<T>;
    private topic : string;

    constructor(topic: string, requiredFields: Array<string>) {
        super(`/topic`);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
        this.challengeValidator = new QueryValidator<ChallengeQuery>();
        this.hookDataValidator = new PartialBodyValidator<T>(requiredFields);
    }

    public setup() {
        this.router.get(this.topic, this.handleChallenge);
        this.router.post(this.topic, this.handleWebhookCall);
    }

    public async handleChallenge(request: Request, response: Response) {
		let body : ChallengeQuery = new ChallengeQuery(request.query);
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