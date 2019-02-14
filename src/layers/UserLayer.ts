import UserModel from "../models/UserModel";
import SubscriptionBody from "../schemas/SubscriptionBody";
import TwitchUser from "../schemas/TwitchUser";
import UnsubscriptionBody from "../schemas/UnsubscriptionBody";

export default class UserLayer {
    protected userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) {
        try {
            return await this.userModel.getByID(id);
        } catch (exception) {
            throw new Error(`Failed to find a user with the id: ${id}`);
        }   
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
        let user = this.userModel.getByID(subscriptionBody.userID);
        return user;
    }

    public async unsubscribe(unsubscriptionBody: UnsubscriptionBody) {
        let user = this.userModel.getByID(unsubscriptionBody.userID);
        return user;
    }
}