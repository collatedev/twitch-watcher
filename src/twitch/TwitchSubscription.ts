import ITwitchBody from "../schemas/request/ITwitchBody";
import AuthorizedTopic from "./AuthorizedTopic";

export default class TwitchSubscription {
	public mode: string;
	public userID: number;
	public topic: string;
	public callbackURL: string;
	public authorizationRequired: boolean;
	public scope: string;

	constructor(body: ITwitchBody, topic: string, callbackURL: string) {
		this.mode = "";
		this.topic = topic;
		this.userID = body.userID;
		this.callbackURL = callbackURL;
		this.authorizationRequired = AuthorizedTopic.isAuthorizedTopic(topic);
		this.scope = AuthorizedTopic.scope(topic);
	}
}