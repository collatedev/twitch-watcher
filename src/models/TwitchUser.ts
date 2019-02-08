import TwitchWebhook from "./TwitchWebhook"

export default class TwitchUser {
    id: number;
    streamHook: TwitchWebhook;
    userHook: TwitchWebhook;
    followerHook: TwitchWebhook;

    constructor(id: number) {
        this.id = id;
        this.streamHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
        this.userHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
        this.followerHook = new TwitchWebhook("callbackURL", "topicURL", new Date());
    }
}