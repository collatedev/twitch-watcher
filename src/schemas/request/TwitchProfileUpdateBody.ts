import Validatable from "../../validators/Validatable";
import Validator from "../../validators/Validator";
import IValidator from "../../validators/IValidator";
import ITwitchProfileUpdateBody from "./ITwitchProfileUpdateBody";
import ITwitchProfileUpdateData from "./ITwitchProfileUpdateData";

export default class TwitchProfileUpdateBody extends Validatable implements ITwitchProfileUpdateBody {
	public static readonly Validator : IValidator<TwitchProfileUpdateBody> = new Validator("Twitch Profile Update Body");

	public readonly data: ITwitchProfileUpdateData[];

	constructor(body: any) {
		super();
		this.data = body.data;
	}
}