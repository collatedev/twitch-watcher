import TwitchUser from "../schemas/TwitchUser";

export default class TwitchUserModel {
    public getByID(id: number) {
        return new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}