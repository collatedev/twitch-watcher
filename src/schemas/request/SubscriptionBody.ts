import ISubscriptionBody from "./ISubscriptionBody";
import Validate from "../../validators/Validatable";
import ITwitchBody from "./ITwitchBody";
import IValidator from "../../validators/IValidator";
import Validator from "../../validators/Validator";

export default class SubscriptionBody extends Validate implements ISubscriptionBody, ITwitchBody {
	public static readonly Validator : IValidator<SubscriptionBody> = new Validator("Subscription Body");

	public readonly userID: number;

	constructor(body: any) {
		super();
		this.userID = body.userID;
	}
}