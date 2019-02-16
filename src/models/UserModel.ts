import TwitchUser from "../schemas/user/TwitchUser";

export default class UserModel {
    constructor() {

    }

    public async getByID(id: number) {
        return await new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}