import Router from "./Router";
import * as Express from "express";
import UserLayer from "../layers/UserLayer";

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

    public handleSubscription(request: Express.Request, response: Express.Response) {
        response.send({
            success: true,
            message: "subscribed to pewdiepie"
        });
    }

    public handleUnsubscription(request: Express.Request, response: Express.Response) {
        response.send({
            success: true,
            message: "unsubscribed from t-series"
        });
    }
}