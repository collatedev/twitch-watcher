import UserLayer from "../../src/layers/UserLayer";
import SubscriptionBody from "../../src/schemas/SubscriptionBody";
import TwitchUser from "../../src/schemas/TwitchUser";
import FakeUserModel from "./FakeUserModel";
import TwitchWebhook from "../../src/schemas/TwitchWebhook";

export default class FakeUserLayer extends UserLayer {
    constructor(userModel: FakeUserModel) {
        super(userModel)
    }

    public async getUserInfo(id: number) {
        return this.userModel.getByID(id);
    }

    public async subscribe(subscriptionBody: SubscriptionBody) {
        let userModel = await this.userModel.getByID(subscriptionBody.userID);
        userModel.followerHook = new TwitchWebhook(subscriptionBody.callbackURL, subscriptionBody.topic, null);
        return userModel;
    }
}