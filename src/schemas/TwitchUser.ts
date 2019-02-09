import TwitchWebhook from "./TwitchWebhook"

export default class TwitchUser {
    public id: number;
    public streamHook: TwitchWebhook;
    public userHook: TwitchWebhook;
    public followerHook: TwitchWebhook;

    constructor(id: number) {
        this.id = id;
        this.streamHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
        this.userHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
        this.followerHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
    }
}