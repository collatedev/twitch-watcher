import IUnsubscriptionBody from "./IUnsubscriptionBody";
import Validatable from "../../validators/Validatable";
import ITwitchBody from "./ITwitchBody";
import IValidator from "../../validators/IValidator";
import PartialValidator from "../../validators/PartialValidator";

export default class UnsubscriptionBody extends Validatable implements IUnsubscriptionBody, ITwitchBody {
	public static readonly Validator : IValidator<UnsubscriptionBody> = new PartialValidator("Unsubscription Body", [
		"userID"
	]);

	public readonly userID: number;

	constructor(body: any) {
		super();
		this.userID = body.userID;
	}
}