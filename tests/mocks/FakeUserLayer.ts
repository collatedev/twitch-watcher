import UserLayer from "../../src/layers/UserLayer";
import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";
import FakeUserModel from "./FakeUserModel";
import TwitchWebhook from "../../src/schemas/user/TwitchWebhook";

export default class FakeUserLayer extends UserLayer {
    constructor(userModel: FakeUserModel) {
        super(userModel)
    }

    public async getUserInfo(id: number) {
        return this.userModel.getByID(id);
    }

    public async subscribe(subscriptionBody: SubscriptionBody) {
        const userModel = await this.userModel.getByID(subscriptionBody.userID);
        userModel.followerHook = new TwitchWebhook(subscriptionBody.callbackURL, "topic", null);
        return userModel;
    }
}