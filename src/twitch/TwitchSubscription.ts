import ITwitchBody from "../schemas/request/ITwitchBody";
import AuthorizedTopic from "./AuthorizedTopic";

export default class TwitchSubscription {
	private readonly CallbackRootURL: string = "https://localhost:8080/api/v1/topic";

	public mode: string;
	public userID: number;
	public topic: string;
	public callbackURL: string;
	public authorizationRequired: boolean;
	public scope: string;

	constructor(body: ITwitchBody, topic: string) {
		this.mode = "";
		this.topic = topic;
		this.userID = body.userID;
		this.callbackURL = this.CallbackRootURL;
		this.authorizationRequired = AuthorizedTopic.isAuthorizedTopic(topic);
		this.scope = AuthorizedTopic.scope(topic);
	}
}