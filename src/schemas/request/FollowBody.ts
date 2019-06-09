import Validatable from "../../validators/Validatable";
import Validator from "../../validators/Validator";
import IValidator from "../../validators/IValidator";
import IFollowData from "./IFollowData";
import IFollowBody from "./IFollowBody";

export default class FollowBody extends Validatable implements IFollowBody {
	public static readonly Validator : IValidator<FollowBody> = new Validator("Follow Body");

	public readonly data: IFollowData[];

	constructor(body: any) {
		super();
		this.data = body.data;
	}
}