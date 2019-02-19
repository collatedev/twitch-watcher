import ITwitchBody from "../schemas/request/ITwitchBody";

export default class TwitchSubscription {
	private readonly AuthorizedTopics: Array<string> = ["user"];

	public mode: string;
	public userID: number;
	public topic: string;
	public callbackURL: string;
	public authorizationRequired: boolean;

	constructor(body: ITwitchBody, topic: string) {
		this.topic = topic;
		this.userID = body.userID;
		this.callbackURL = body.callbackURL;
		this.authorizationRequired = this.AuthorizedTopics.includes(topic);
	}
}