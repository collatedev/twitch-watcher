import TwitchUserModel from "../models/TwitchUserModel";

export default class HookController {
    private twitchUserModel: TwitchUserModel;

    constructor() {
        this.twitchUserModel = new TwitchUserModel();
    }

    public getUserInfo(id: number) {
        return this.twitchUserModel.getByID(id);
    }
}