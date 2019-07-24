import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";
import FakeUserModel from "./FakeUserModel";
import TwitchUser from "../../src/schemas/user/TwitchUser";
import IUserModel from "../../src/models/IUserModel";
import IUserLayer from "../../src/layers/IUserLayer";
import UnsubscriptionBody from "../../src/schemas/request/UnsubscriptionBody";

export default class FakeUserLayer implements IUserLayer {
    private userModel : IUserModel;

    constructor(userModel: FakeUserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) : Promise<TwitchUser> {
        return this.userModel.getByID(id);
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
        const userModel : TwitchUser = await this.userModel.getByID(subscriptionBody.userID);
        return userModel;
    }

    public async unsubscribe(unsubscriptionBody: UnsubscriptionBody) : Promise<TwitchUser> {
        const userModel : TwitchUser = await this.userModel.getByID(unsubscriptionBody.userID);
        return userModel;
    }
}