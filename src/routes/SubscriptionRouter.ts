import Router from "./Router";
import { Request, Response } from "express";
import UserLayer from "../layers/UserLayer";
import SubscriptionBody from "../schemas/request/SubscriptionBody";
import UnsubscriptionBody from "../schemas/request/UnsubscriptionBody";
import StatusCodes from "./StatusCodes";
import TwitchUser from "../schemas/user/TwitchUser";
import SubscriptionRequestSchema from '../api/SubscriptionRequest.json';
import { ValidationSchema } from "@collate/request-validator";
import { ILogger } from "@collate/logging";

export default class SubscriptionRouter extends Router {
    private userLayer : UserLayer;

    constructor(userLayer: UserLayer, logger : ILogger) {
        super('/user/subscriptions', logger);
        this.userLayer = userLayer;

        this.handleSubscription = this.handleSubscription.bind(this);
        this.handleUnsubscription = this.handleUnsubscription.bind(this);
    }

    public setup(): void {
        this.post('/subscribe', this.handleSubscription, new ValidationSchema(SubscriptionRequestSchema));
        this.post('/unsubscribe', this.handleUnsubscription, new ValidationSchema(SubscriptionRequestSchema));
    }

    public async handleSubscription(request: Request, response: Response) : Promise<void> {
        await this.subscribeToWebhook(response, new SubscriptionBody(request.body));
	}
	
	private async subscribeToWebhook(response: Response, subscriptionData: SubscriptionBody) : Promise<void> {
		try {
            const user : TwitchUser = await this.userLayer.subscribe(subscriptionData);
            this.logger.info(`successfully subscribed user (id=${subscriptionData.userID}) to webhooks`);
            this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            this.logger.error(error);
            this.sendError(response, "Failed to subscribe user to webhook", StatusCodes.InternalError);
        }
	}

    public async handleUnsubscription(request: Request, response: Response) : Promise<void> {
        await this.unsubscribeFromWebhook(response, new SubscriptionBody(request.body));
	}
	
	private async unsubscribeFromWebhook(response: Response, unsubscriptionData: UnsubscriptionBody) : Promise<void> {
		try {
            const user : TwitchUser = await this.userLayer.unsubscribe(unsubscriptionData);
            this.logger.info(`successfully unsubscribed user (id=${unsubscriptionData.userID}) from webhooks`);
            this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            this.logger.error(error);
            this.sendError(response, "Failed to unsubscribe user from webhook", StatusCodes.InternalError);
        }
	}
}