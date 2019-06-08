import Router from "./Router";
import { Request, Response } from "express";
import ChallengeQuery from "../schemas/request/ChallengeQuery";
import StatusCodes from "./StatusCodes";
import { Logger } from "../config/Winston";
import IValidatable from "../validators/IValidatable";
import IValidator from "../validators/IValidator";

export default abstract class TopicRouter<T extends IValidatable> extends Router {
    private hookDataValidator: IValidator<T>;
    private topic : string;

    constructor(topic: string, validator: IValidator<T>) {
        super(`/topic`);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
        this.hookDataValidator = validator;
    }

    public setup() : void {
        this.router.get(this.topic, this.handleChallenge);
        this.router.post(this.topic, this.handleWebhookCall);
    }

    public async handleChallenge(request: Request, response: Response) : Promise<void> {
		const body : ChallengeQuery = new ChallengeQuery(request.query);
		console.log("here");
        if (!ChallengeQuery.Validator.isValid(body)) {
            Logger.error(
				`Did Twitch challenge data change? Or has Twitch Services failed? body: ${JSON.stringify(body)}`
			);
            ChallengeQuery.Validator.sendError(response, body);
        } else {
			response.send(body["hub.challenge"]).status(StatusCodes.OK);
		}
	}
    

    public async handleWebhookCall(request: Request, response: Response) : Promise<void> {
        const body : T = this.getBody(request.body);
        if (!this.hookDataValidator.isValid(body)) {
            Logger.error(
				`Did Twitch ${this.topic} data schema change? Has Twitch Services failed? Does our schema not match Twitch?`
			);
            this.hookDataValidator.sendError(response, body);
        } else {
			await this.processWebhook(response, body);
		}
	}

	protected abstract getBody(body: any) : T;
	
	private async processWebhook(response: Response, body: T) : Promise<void> {
		try {
			await this.handleWebhookData(body);
			Logger.info(`Successfuly processed webhook at topic: '${this.topic}'`);
			this.sendData(response, {
				desc: `Recieved data under topic: ${this.topic}`,
				body,
				processedData: true,
			}, StatusCodes.OK);
		} catch (error) {
			Logger.error(error);
			this.sendError(response, "Failed to process webhook data", StatusCodes.InternalError);
		}
	}

    protected abstract async handleWebhookData(body: T): Promise<void>;
}