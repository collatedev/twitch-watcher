import Router from "./Router";
import { Request, Response } from "express";
import UserLayer from "../layers/UserLayer";
import SubscriptionBody from "../schemas/request/SubscriptionBody";
import { Logger } from "../config/Winston";
import UnsubscriptionBody from "../schemas/request/UnsubscriptionBody";
import StatusCodes from "./StatusCodes";
import BodyValidator from "../validators/BodyValidator";


export default class SubscriptionRouter extends Router {
    private userLayer : UserLayer;
    private unsubscribeBodyValidator: BodyValidator<UnsubscriptionBody>;
    private subscribeBodyValidator: BodyValidator<SubscriptionBody>;

    constructor(userLayer: UserLayer) {
        super('/user/subscriptions');
        this.userLayer = userLayer;
        
        this.unsubscribeBodyValidator = new BodyValidator<UnsubscriptionBody>();
        this.subscribeBodyValidator = new BodyValidator<SubscriptionBody>();

        this.handleSubscription = this.handleSubscription.bind(this);
        this.handleUnsubscription = this.handleUnsubscription.bind(this);
    }

    public setup(): void {
        this.router.post('/subscribe', this.handleSubscription);
        this.router.post('/unsubscribe', this.handleUnsubscription);
    }

    public async handleSubscription(request: Request, response: Response) {
        let body = new SubscriptionBody(request.body);
        if (!this.subscribeBodyValidator.isValid(body)) {
            Logger.error(`Invalid subscribe body: ${JSON.stringify(body)}`);
            return this.subscribeBodyValidator.sendError(response, body);
        }
        try {
            let user = await this.userLayer.subscribe(body);
            Logger.info(`successfully subscribed user (id=${body.userID}) to topic: ${body.topic}`);
            return this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            Logger.error(error)
            return this.sendError(response, "Failed to subscribe user to webhook", StatusCodes.InternalError);
        }
    }

    public async handleUnsubscription(request: Request, response: Response) {
        let body = new UnsubscriptionBody(request.body);
        if (!this.unsubscribeBodyValidator.isValid(body)) {
            Logger.error(`Invalid unsubscribe body: ${JSON.stringify(body)}`);
            return this.unsubscribeBodyValidator.sendError(response, body);
        }
        try {
            let user = await this.userLayer.unsubscribe(body);
            Logger.info(`successfully unsubscribed user (id=${body.userID}) from topic: ${body.topic}`);
            return this.sendData(response, user, StatusCodes.OK);
        } catch (error) {
            Logger.error(error)
            return this.sendError(response, "Failed to unsubscribe user from webhook", StatusCodes.InternalError);
        }
    }
}