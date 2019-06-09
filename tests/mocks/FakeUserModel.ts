import UserModel from "../../src/models/UserModel";
import TwitchUser from "../../src/schemas/user/TwitchUser";

export default class FakeUserModel extends UserModel {
    private db : { [key: number]: TwitchUser; };

    constructor() {
        super();
        this.db = {};
    }

    public addUser(id: number) : void {
        this.db[id] = new TwitchUser(id);
        this.db[id].followerHook = null;
        this.db[id].streamHook = null;
        this.db[id].userHook = null;
    }

    public async getByID(id: number) : Promise<TwitchUser> {
        if (!this.db.hasOwnProperty(id)) {
            throw new Error(`Failed to get twitch user with id: ${id} from database`);
        } else {
			return this.db[id];
		}
    }
}