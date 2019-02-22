import Validatable from "../../validators/Validatable";
import ITwitchOAuthBearer from "./ITwitchOAuthBearer";

export default class TwitchOAuthBearer extends Validatable implements ITwitchOAuthBearer {
	public static readonly ClientAuthFields : string[] = ["accessToken", "scope"];

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