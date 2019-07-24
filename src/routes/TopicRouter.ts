import Router from "./Router";
import { Request, Response } from "express";
import ChallengeQuery from "../schemas/request/ChallengeQuery";
import StatusCodes from "./StatusCodes";
import { IValidationSchema, ValidationSchema } from "@collate/request-validator";
import WebhookChallengeRequestSchema from "../api/WebhookChallengeRequest.json";
import { ILogger } from "@collate/logging";

export default abstract class TopicRouter extends Router {
	private topic : string;
	private readonly schema : IValidationSchema;
	private readonly challengeSchema : IValidationSchema;

    constructor(topic: string, schema : IValidationSchema, logger : ILogger) {
		super(`/topic`, logger);
		this.schema = schema;
		this.challengeSchema = new ValidationSchema(WebhookChallengeRequestSchema);
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
    }

    public setup() : void {
        this.get(this.topic, this.handleChallenge, this.challengeSchema);
        this.post(this.topic, this.handleWebhookCall, this.schema);
    }

    public async handleChallenge(request: Request, response: Response) : Promise<void> {
        response.send(new ChallengeQuery(request.query)["hub.challenge"]).status(StatusCodes.OK);
	}
    
    public async handleWebhookCall(request: Request, response: Response) : Promise<void> {
        try {
			await this.handleWebhookData(request.body);
			this.logger.info(`Successfuly processed webhook at topic: '${this.topic}'`);
			this.sendData(response, {
				desc: `Recieved data under topic: ${this.topic}`,
				body: request.body,
				processedData: true,
			}, StatusCodes.OK);
		} catch (error) {
			this.logger.error(error);
			this.sendError(response, "Failed to process webhook data", StatusCodes.InternalError);
		}
	}

	public getSchema() : IValidationSchema {
		return this.schema;
	}

	public getChallengeSchema() : IValidationSchema {
		return this.challengeSchema;
	}

    protected abstract async handleWebhookData(rawBody: any): Promise<void>;
}