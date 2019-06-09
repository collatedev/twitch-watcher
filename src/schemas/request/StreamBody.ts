import Validatable from "../../validators/Validatable";
import IStreamBody from "./IStreamBody";
import IStreamData from "./IStreamData";
import Validator from "../../validators/Validator";
import IValidator from "../../validators/IValidator";

export default class StreamBody extends Validatable implements IStreamBody {
	public static readonly Validator : IValidator<StreamBody> = new Validator("Stream Body");

	public readonly data: IStreamData[];

	constructor(body: any) {
		super();
		this.data = body.data;
	}
}