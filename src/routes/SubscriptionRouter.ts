import Router from "./Router";
import * as Express from "express";
import UserLayer from "../layers/UserLayer";
import SubscriptionBody from "../bodys/SubscriptionBody";
import BodyValidator from "../validators/BodyValidator";
import { Logger } from "../config/Winston";
import UnsubscriptionBody from "../bodys/UnsubscriptionBody";

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

    public async handleSubscription(request: Express.Request, response: Express.Response) {
        let requiredFields = ["callbackURL", "topic", "userID"]
        let validator = new BodyValidator(requiredFields);
        let body = request.body as SubscriptionBody;
        
        if (!validator.isValidRequestBody<SubscriptionBody>(body)) {
            this.sendError(response, validator.getErrorMessage<SubscriptionBody>(body), 400);
        }
        try {
            let user = await this.userLayer.subscribe(body);
            this.sendData(response, user, 200);
        } catch (error) {
            Logger.error(error)
            this.sendError(response, "Failed to subscribe user to webhook", 500);
        }
    }

    public async handleUnsubscription(request: Express.Request, response: Express.Response) {
        let requiredFields = ["topic", "userID"]
        let validator = new BodyValidator(requiredFields);
        let body = request.body as UnsubscriptionBody;

        if (!validator.isValidRequestBody<UnsubscriptionBody>(body)) {
            this.sendError(response, validator.getErrorMessage<UnsubscriptionBody>(body), 400);
        }
        try {
            let user = await this.userLayer.unsubscribe(body);
            this.sendData(response, user, 200);
        } catch (error) {
            Logger.error(error)
            this.sendError(response, "Failed to unsubscribe user from webhook", 500);
        }
    }
}