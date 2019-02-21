import TwitchUser from "../schemas/user/TwitchUser";

export default class UserModel {
    public async getByID(id: number) {
        return new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}