import TwitchUserModel from "../models/TwitchUserModel";
import DataMessage from "../schemas/DataMessage";
import IController from "./IController";

export default class HookController implements IController {
    private twitchUserModel: TwitchUserModel;

    constructor(twitchUserModel: TwitchUserModel) {
        this.twitchUserModel = twitchUserModel;
    }

    public async getUserInfo(id: number) {
        return new DataMessage(await this.twitchUserModel.getByID(id));
    }
}