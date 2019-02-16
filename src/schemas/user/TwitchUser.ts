import TwitchWebhook from "./TwitchWebhook"

export default class TwitchUser {
    public id: number;
    public streamHook: TwitchWebhook;
    public userHook: TwitchWebhook;
    public followerHook: TwitchWebhook;

    constructor(id: number) {
        this.id = id;
        this.streamHook = null
        this.userHook = null
        this.followerHook = null
    }
}