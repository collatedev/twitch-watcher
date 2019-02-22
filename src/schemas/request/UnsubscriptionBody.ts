import IUnsubscriptionBody from "./IUnsubscriptionBody";
import Validatable from "../../validators/Validatable";
import ITwitchBody from "./ITwitchBody";

export default class UnsubscriptionBody extends Validatable implements IUnsubscriptionBody, ITwitchBody {
	public readonly userID: number;
	public readonly callbackURL: string;

	constructor(body: any) {
		super();
		this.userID = body.userID;
		this.callbackURL = "";
	}
}