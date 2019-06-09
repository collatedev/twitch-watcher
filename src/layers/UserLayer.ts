import UserModel from "../models/UserModel";
import SubscriptionBody from "../schemas/request/SubscriptionBody";
import TwitchUser from "../schemas/user/TwitchUser";
import UnsubscriptionBody from "../schemas/request/IUnsubscriptionBody";
import Twitch from "../twitch/Twitch";

export default class UserLayer {
    protected userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) : Promise<TwitchUser> {
        try {
            return await this.userModel.getByID(id);
        } catch (exception) {
            throw new Error(`Failed to find a user with the id: ${id}`);
        }   
    }

    public async subscribe(subscriptionBody: SubscriptionBody) : Promise<TwitchUser> {
		const user : TwitchUser = await this.userModel.getByID(subscriptionBody.userID); // should be the user service library
		await Twitch.subscribe(subscriptionBody);
        return user;
	}

    public async unsubscribe(unsubscriptionBody: UnsubscriptionBody): Promise<TwitchUser> {
        const user : TwitchUser = await this.userModel.getByID(unsubscriptionBody.userID);
        return user;
    }
}