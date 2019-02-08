import TwitchUser from "../schemas/TwitchUser";

export default class TwitchUserModel {
    public async getByID(id: number) {
        return await new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}