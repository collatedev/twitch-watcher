export default class TwitchWebhook {
    private callbackURL: string;
    private topicURL: string;
    private expirationDate: Date;

    constructor(callbackURL: string, topicURL: string, expirationDate: Date) {
        this.callbackURL = callbackURL;
        this.topicURL = topicURL;
        this.expirationDate = expirationDate;
    }
}