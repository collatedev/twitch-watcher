import TwitchUserModel from "../../src/models/TwitchUserModel";
import TwitchUser from "../../src/schemas/TwitchUser";

export default class FakeTwitchUserModel extends TwitchUserModel {
    constructor() {
        super();
    }

    public async getByID(id: number) {
        return await new TwitchUser(id); // make request to twitch webhook manager (database and cache)
    }
}