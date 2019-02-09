import UserModel from "../models/UserModel";
import SubscriptionBody from "../bodys/SubscriptionBody";
import TwitchUser from "../schemas/TwitchUser";

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
        return null
    }
}