import Validatable from "../../validators/Validatable";
import ITwitchOAuthBearer from "./ITwitchOAuthBearer";
import IValidator from "../../validators/IValidator";
import PartialValidator from "../../validators/PartialValidator";

export default class TwitchOAuthBearer extends Validatable implements ITwitchOAuthBearer {
	public static readonly ClientAuthFields : string[] = ["accessToken", "scope"];
	public static readonly Validator : IValidator<TwitchOAuthBearer> = 
		new PartialValidator("Access Token", TwitchOAuthBearer.ClientAuthFields);

	public readonly error: string;
	public readonly status: number;
	public readonly message: string;
	public readonly accessToken: string;	
	public readonly refreshToken: string;
	public readonly scope: string[];

	constructor(body: any) {
		super();
		this.accessToken = body.access_token;
		this.refreshToken = body.refresh_token;
		this.scope = body.scope;
		this.message = body.message;
		this.error = body.error;
		this.status = body.status;
	}
}