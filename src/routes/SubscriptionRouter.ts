import Router from "./Router";
import { Request, Response } from "express";
import UserLayer from "../layers/UserLayer";
import SubscriptionBody from "../schemas/request/SubscriptionBody";
import { Logger } from "../config/Winston";
import UnsubscriptionBody from "../schemas/request/UnsubscriptionBody";
import StatusCodes from "./StatusCodes";
import TwitchUser from "../schemas/user/TwitchUser";


export default class SubscriptionRouter extends Router {
    private userLayer : UserLayer;

    constructor(userLayer: UserLayer) {
        super('/user/subscriptions');
        this.userLayer = userLayer;

        this.handleSubscription = this.handleSubscription.bind(this);
        this.handleUnsubscription = this.handleUnsubscription.bind(this);
    }

    public setup(): void {
        this.router.post('/subscribe', this.handleSubscription);
        this.router.post('/unsubscribe', this.handleUnsubscription);
    }

    public async handleSubscription(request: Request, response: Response) : Promise<void> {
        const body : SubscriptionBody = new SubscriptionBody(request.body);
        if (!SubscriptionBody.Validator.isValid(body)) {
            Logger.error(`Invalid subscribe body: ${JSON.stringify(body)}`);
            SubscriptionBody.Validator.sendError(response, body);
        } else {
			await this.subscribeToWebhook(response, body);
		}
	}
	
	private async subscribeToWebhook(response: Response, body: SubscriptionBody) : Promise<void> {
		try {
            const user : TwitchUser = await this.userLayer.subscribe(body);
            Logger.info(`successfully subscribed user (id=${body.userID}) to webhooks`);
            this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            Logger.error(error);
            this.sendError(response, "Failed to subscribe user to webhook", StatusCodes.InternalError);
        }
	}

    public async handleUnsubscription(request: Request, response: Response) : Promise<void> {
        const body : SubscriptionBody = new UnsubscriptionBody(request.body);
        if (!UnsubscriptionBody.Validator.isValid(body)) {
            Logger.error(`Invalid unsubscribe body: ${JSON.stringify(body)}`);
            return UnsubscriptionBody.Validator.sendError(response, body);
        } else {
			await this.unsubscribeFromWebhook(response, body);
		}
	}
	
	private async unsubscribeFromWebhook(response: Response, body: SubscriptionBody) : Promise<void> {
		try {
            const user : TwitchUser = await this.userLayer.unsubscribe(body);
            Logger.info(`successfully unsubscribed user (id=${body.userID}) from webhooks`);
            this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            Logger.error(error);
            this.sendError(response, "Failed to unsubscribe user from webhook", StatusCodes.InternalError);
        }
	}
}