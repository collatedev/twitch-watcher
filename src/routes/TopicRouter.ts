import Router from "./Router";
import { Request, Response } from "express";
import ChallengeQuery from "../schemas/request/ChallengeQuery";
import StatusCodes from "./StatusCodes";
import { Logger } from "../logging/Winston";
import { IValidationSchema, ValidationSchema } from "@collate/request-validator";
import WebhookChallengeRequestSchema from "../../api/WebhookChallengeRequest.json";

export default abstract class TopicRouter extends Router {
	private topic : string;
	private schema : IValidationSchema;

    constructor(topic: string, schema : IValidationSchema) {
		super(`/topic`);
		this.schema = schema;
        this.topic = topic;
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWebhookCall = this.handleWebhookCall.bind(this);
    }

    public setup() : void {
        this.get(this.topic, this.handleChallenge, new ValidationSchema(WebhookChallengeRequestSchema));
        this.post(this.topic, this.handleWebhookCall, this.schema);
    }

    public async handleChallenge(request: Request, response: Response) : Promise<void> {
        response.send(new ChallengeQuery(request.query)["hub.challenge"]).status(StatusCodes.OK);
	}
    

    public async handleWebhookCall(request: Request, response: Response) : Promise<void> {
        try {
			await this.handleWebhookData(request.body);
			Logger.info(`Successfuly processed webhook at topic: '${this.topic}'`);
			this.sendData(response, {
				desc: `Recieved data under topic: ${this.topic}`,
				body: request.body,
				processedData: true,
			}, StatusCodes.OK);
		} catch (error) {
			Logger.error(error);
			this.sendError(response, "Failed to process webhook data", StatusCodes.InternalError);
		}
	}

    protected abstract async handleWebhookData(rawBody: any): Promise<void>;
}