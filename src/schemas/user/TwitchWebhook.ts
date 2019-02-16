export default class TwitchWebhook {
    public callbackURL: string;
    public topicURL: string;
    public expirationDate: Date;

    constructor(callbackURL: string, topicURL: string, expirationDate: Date) {
        this.callbackURL = callbackURL;
        this.topicURL = topicURL;
        this.expirationDate = expirationDate;
    }
}