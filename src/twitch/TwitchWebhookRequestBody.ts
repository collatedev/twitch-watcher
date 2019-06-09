import ITwitchWebhookRequestBody from "./ITwitchWebhookRequestBody";
import * as Path from "path";
import TwitchSubscription from "./TwitchSubscription";
import SecretGenerator from "./SecretGenerator";
import ITwitchRequestBody from "./ITwitchRequestBody";
import AuthorizedTopic from "./AuthorizedTopic";

export default class TwitchWebhookRequestBody implements ITwitchWebhookRequestBody, ITwitchRequestBody {
	public static SecretGenerator: SecretGenerator = new SecretGenerator(SecretGenerator.DefaultAlphabet);

	private isAuthorizedTopic: boolean;
	private scope: string;

	public "hub.mode": string;
	public "hub.topic": string;
	public "hub.callback": string;
	public "hub.lease_seconds": number;
	public "hub.secret": string;

	private readonly LeaseSeconds : number = 864000; // 10 days in seconds
	private readonly SecretSize : number = 16;

	constructor(subscription: TwitchSubscription) {
		this.isAuthorizedTopic = AuthorizedTopic.isAuthorizedTopic(subscription.topic);
		this.scope = AuthorizedTopic.scope(subscription.topic);
		this.setupBodyFields(subscription);
	}

	private setupBodyFields(subscription: TwitchSubscription) : void {
		this["hub.mode"] = subscription.mode;
		this["hub.lease_seconds"] = this.LeaseSeconds;
		this["hub.secret"] = TwitchWebhookRequestBody.SecretGenerator.generateSecret(this.SecretSize);
		this["hub.callback"] = Path.join(subscription.callbackURL, subscription.topic).replace(':', ':/');
		this["hub.topic"] = this.generateTopicURL(subscription);
	}

	private generateTopicURL(subscription: TwitchSubscription): string {
		switch(subscription.topic) {
			case "follow/new":
				return `https://api.twitch.tv/helix/users/follows?first=1&to_id=${subscription.userID}`;
			case "follow/followed":
				return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${subscription.userID}`;
			case "user":
				return `https://api.twitch.tv/helix/users?id=${subscription.userID}`;
			case "streams":
				return `https://api.twitch.tv/helix/streams?user_id=${subscription.userID}`;
			default:
				throw new Error(`Unknown topic: '${subscription.topic}'`);
		}
	}

	public requiresAuthorization() : boolean {
		return this.isAuthorizedTopic;
	}

	public getScope() : string {
		return this.scope;
	}

	public getBody() : string {
		return JSON.stringify({
			"hub.mode": this["hub.mode"],
			"hub.topic": this["hub.topic"],
			"hub.secret": this["hub.secret"],
			"hub.callback": this["hub.callback"],
			"hub.lease_seconds": this["hub.lease_seconds"]
		});
	}
}	