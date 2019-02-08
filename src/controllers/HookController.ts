import TwitchUserModel from "../models/TwitchUserModel";
import DataMessage from "../schemas/DataMessage";

export default class HookController {
    private twitchUserModel: TwitchUserModel;

    constructor() {
        this.twitchUserModel = new TwitchUserModel();
    }

    public async getUserInfo(id: number) {
        return new DataMessage(await this.twitchUserModel.getByID(id));
    }
}