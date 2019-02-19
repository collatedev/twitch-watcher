import IUnsubscriptionBody from "./IUnsubscriptionBody";
import Validatable from "../../validators/Validatable";
import ITwitchBody from "./ITwitchBody";

export default class UnsubscriptionBody extends Validatable implements IUnsubscriptionBody, ITwitchBody {
	userID: number;
	callbackURL: string;

	constructor(body: any) {
		super();
		this.userID = body.userID;
	}
}