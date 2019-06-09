import TwitchWebhook from "../src/schemas/user/TwitchWebhook";

export default interface ITwitchWatcher {
	subscribe(topic: string, userID: number): Promise<boolean>;
	unsubscribe(topic: string, userID: number): Promise<boolean>;
	getUserSubscriptions(userID: number): Promise<Array<TwitchWebhook>>;
}