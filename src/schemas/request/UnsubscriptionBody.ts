import IUnsubscriptionBody from "./IUnsubscriptionBody";
import Validatable from "../../validators/Validatable";

export default class UnsubscriptionBody extends Validatable implements IUnsubscriptionBody {
	topic: string;
	userID: number;

	constructor(body: any) {
		super();
		this.topic = body.topic;
		this.userID = body.userID;
	}
}