import UserLayer from "../../src/layers/UserLayer";
import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";
import FakeUserModel from "./FakeUserModel";
import TwitchWebhook from "../../src/schemas/user/TwitchWebhook";
import TwitchUser from "../../src/schemas/user/TwitchUser";

export default class FakeUserLayer extends UserLayer {
    constructor(userModel: FakeUserModel) {
        super(userModel);
    }

    public async getUserInfo(id: number) : Promise<TwitchUser> {
        return this.userModel.getByID(id);
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
        const userModel : TwitchUser = await this.userModel.getByID(subscriptionBody.userID);
        userModel.followerHook = new TwitchWebhook("callbackURL", "topic", null);
        return userModel;
    }
}