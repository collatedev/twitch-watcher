import ITwitchRequestBody from "./ITwitchRequestBody";
import * as Path from "path";
import TwitchSubscription from "./TwitchSubscription";
import SecretGenerator from "./SecretGenerator";

export default class TwitchRequestBody implements ITwitchRequestBody {
	public static SecretGenerator: SecretGenerator = new SecretGenerator(
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()"
	);

	public "hub.mode": string;
	public "hub.topic": string;
	public "hub.callback": string;
	public "hub.lease_seconds": number;
	public "hub.secret": string;

	private readonly LeaseSeconds = 10 * 24 * 60 * 60; // 10 days in seconds
	private readonly SecretSize = 16;
	

	constructor(subscription: TwitchSubscription) {
		this["hub.mode"] = subscription.mode;
		this["hub.lease_seconds"] = this.LeaseSeconds;
		this["hub.secret"] = TwitchRequestBody.SecretGenerator.generateSecret(this.SecretSize);
		this["hub.callback"] = Path.join(subscription.callbackURL, subscription.topic);
		this["hub.topic"] = TwitchRequestBody.generateTopicURL(subscription);
	}

	private static generateTopicURL(subscription: TwitchSubscription): string {
		switch(subscription.topic) {
			case "follow/new":
				return `https://api.twitch.tv/helix/users/follows?first=1&to_id=${subscription.userID}`;;
			case "follow/followed":
				return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${subscription.userID}`;
			case "user":
				return `https://api.twitch.tv/helix/users?id=${subscription.userID}`;
			case "streams":
				return `https://api.twitch.tv/helix/streams?user_id=${subscription.userID}`;
			default:
				throw new Error(`Unknown topic: ${subscription.topic}`);
		}
	}

	public getBody() {
		return JSON.stringify({
			"hub.mode": this["hub.mode"],
			"hub.topic": this["hub.topic"],
			"hub.secret": this["hub.secret"],
			"hub.callback": this["hub.callback"],
			"hub.lease_seconds": this["hub.lease_seconds"]
		});
	}
}	