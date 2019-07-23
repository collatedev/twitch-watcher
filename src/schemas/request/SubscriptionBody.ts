import ISubscriptionBody from "./ISubscriptionBody";
import ITwitchBody from "./ITwitchBody";

export default class SubscriptionBody implements ISubscriptionBody, ITwitchBody {
	public readonly userID: number;

	constructor(body: any) {
		super();
		this.userID = body.userID;
	}
}