import ITwitch from "../../src/twitch/ITwitchService";
import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";

export default class FakeTwitchService implements ITwitch {
    public async subscribe(body: SubscriptionBody): Promise<void> {
        return new Promise((resolve : () => void) : void => {
            return resolve();
        });
    }

}