import ISubscriptionBody from "./ISubscriptionBody";
import Validate from "../../validators/Validatable";

export default class SubscriptionBody extends Validate implements ISubscriptionBody {
	callbackURL: string;
	topic: string;
	userID: number;

	constructor(body: any) {
		super();
		this.callbackURL = body.callbackURL;
		this.topic = body.topic;
		this.userID = body.userID;
	}
}