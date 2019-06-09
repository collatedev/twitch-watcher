import ITwitchBody from "../schemas/request/ITwitchBody";

export default class TwitchSubscription {
	public mode: string;
	public userID: number;
	public topic: string;
	public callbackURL: string;

	constructor(body: ITwitchBody, topic: string, callbackURL: string) {
		this.mode = "";
		this.topic = topic;
		this.userID = body.userID;
		this.callbackURL = callbackURL;
	}
}