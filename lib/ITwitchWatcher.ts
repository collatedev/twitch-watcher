import TwitchWebhook from "../src/schemas/user/TwitchWebhook";

export default interface ITwitchWatcher {
	subscribe(userID: number): Promise<boolean>;
	unsubscribe(userID: number): Promise<boolean>;
	getUserSubscriptions(userID: number): Promise<TwitchWebhook[]>;
	
}