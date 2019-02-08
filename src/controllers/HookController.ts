import TwitchUser from "../models/TwitchUser"

export default class HookController {
    public getUser() {
        return new TwitchUser(1);
    }
}