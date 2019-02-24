import ITwitchBody from "../schemas/request/ITwitchBody";

export default class TwitchSubscription {
	private readonly AuthorizedTopics: { [id: string]: string[] } = {
		"user": ["user:read:email"]
	};

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
		this.callbackURL = "https://localhost:8080/api/v1/topic/";
		this.authorizationRequired = this.AuthorizedTopics.hasOwnProperty(topic);
		this.scope = this.authorizationRequired ? 
			this.AuthorizedTopics[topic].join(" ").trim() :
			"";
	}
}