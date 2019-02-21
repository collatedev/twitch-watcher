import ISubscriptionBody from "./ISubscriptionBody";
import Validate from "../../validators/Validatable";
import ITwitchBody from "./ITwitchBody";

export default class SubscriptionBody extends Validate implements ISubscriptionBody, ITwitchBody {
	public readonly callbackURL: string;
	public readonly userID: number;

	constructor(body: any) {
		super();
		this.callbackURL = body.callbackURL;
		this.userID = body.userID;
	}
}