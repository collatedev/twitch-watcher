import ITwitchRequest from "./ITwitchRequest";
import { RequestInit, Response, Headers } from 'node-fetch';
import TwitchResponse from "./TwitchResponse";
import TwitchOAuthBearer from "../schemas/request/TwitchOAuthBearer";
import ITwitchRequestBody from "./ITwitchRequestBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";
import TwitchOAuthBearerSchema from "../../api/TwitchOAuthBearer.json";
import { 
	ValidationSchema, 
	IValidationResult, 
	IValidator, 
	Validator, 
	IValidationSchema,
	Validatable
} from "@collate/request-validator";

type TwitchResolver = (response: TwitchResponse) => void;
type TwitchRejector = (error: Error) => void;

export default abstract class TwitchRequest implements ITwitchRequest {
	private readonly SubscriptionEndpoint : string = "https://api.twitch.tv/helix/webhooks/hub";
	
	private requestBuilder : IRequestBuilder;
	private body: ITwitchRequestBody;
	private tokenValidator : IValidator;
	private tokenValidationSchema : IValidationSchema;

	constructor(body: ITwitchRequestBody, requestBuilder: IRequestBuilder) {
		this.requestBuilder = requestBuilder;
		this.body = body;
		this.tokenValidator = new Validator();
		this.tokenValidationSchema = new ValidationSchema(TwitchOAuthBearerSchema);
		this.buildRequest = this.buildRequest.bind(this);
	}

	public async send(): Promise<TwitchResponse> {
		return new Promise<TwitchResponse>(this.buildRequest);
	}

	private async buildRequest(resolve: TwitchResolver, reject: TwitchRejector) : Promise<void> {
		try {
			const request: RequestInit = await this.prepareRequest();
			this.requestBuilder.makeRequest(
				this.SubscriptionEndpoint, 
				request
			).then((response : Response) => {
				return resolve(new TwitchResponse(request, response));
			}).catch((error : Error) => {
				return reject(error);
			});
		} catch (error) {
			return reject(error);
		}
	}

	private async prepareRequest() : Promise<RequestInit> {
		return {
			headers: await this.getHeaders(),
			body: this.body.getBody(),
			method: "POST"
		};
	}

	private async getHeaders(): Promise<Headers> {
		const clientID : string = this.getClientID();
		if (this.body.requiresAuthorization()) {
			return new Headers({
				"Client-ID": clientID,
				"Content-Type": "application/json",
				"Authorization": `Bearer ${await this.getOAuthToken()}`
			});
		} else {
			return new Headers({
				"Client-ID": clientID,
				"Content-Type": "application/json"
			});
		}
	}

	private getClientID() : string {
		return process.env.TWITCH_CLIENT_ID !== undefined ?
				process.env.TWITCH_CLIENT_ID :
				"";
	}

	private async getOAuthToken(): Promise<string> {
		try {
			return await this.getAccessToken();
		} catch(error) {
			throw error;
		}
	}

	private async getAccessToken() : Promise<string> {
		const response : Response = await this.requestBuilder.makeRequest(
			this.getAccessTokenRequestURL(), 
			{ method: "POST" }
		);
		const json : any = await response.json();
		const bearer : TwitchOAuthBearer = new TwitchOAuthBearer(json);
		const result : IValidationResult = this.tokenValidator.validate(new Validatable(json), this.tokenValidationSchema);

		if (result.isValid()) {
			if (bearer.error) {
				throw new Error(`[${bearer.error}]: ${bearer.message}`);
			}
			return bearer.accessToken;
		}
		throw new Error(this.getErrorMessage(result));
	}

	private getErrorMessage(result : IValidationResult) : string {
		const spacing : number = 4;
		return JSON.stringify(result.errors(), null, spacing);
	}

	private getAccessTokenRequestURL() : string {
		return `https://id.twitch.tv/oauth2/token?client_id=` +
			`${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}` +
			`&grant_type=client_credentials&scope=${this.body.getScope()}`;
	}
}