import ITwitchRequest from "./ITwitchRequest";
import { RequestInit, Response, Headers } from 'node-fetch';
import TwitchResponse from "./TwitchResponse";
import TwitchOAuthBearer from "../schemas/request/TwitchOAuthBearer";
import PartialValidator from "../validators/PartialValidator";
import ITwitchRequestBody from "./ITwitchRequestBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";

type TwitchResolver = (response: TwitchResponse) => void;
type TwitchRejector = (error: Error) => void;

export default abstract class TwitchRequest implements ITwitchRequest {
	private readonly SubscriptionEndpoint : string = "https://api.twitch.tv/helix/webhooks/hub";
	
	private requestBuilder : IRequestBuilder;
	private tokenValidator : PartialValidator<TwitchOAuthBearer>;
	private body: ITwitchRequestBody;

	constructor(body: ITwitchRequestBody, requestBuilder: IRequestBuilder) {
		this.requestBuilder = requestBuilder;
		this.body = body;

		this.tokenValidator = new PartialValidator<TwitchOAuthBearer>("Token", TwitchOAuthBearer.ClientAuthFields);
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
		const bearer : TwitchOAuthBearer = new TwitchOAuthBearer(await response.json());
		if (this.tokenValidator.isValid(bearer)) {
			return bearer.accessToken;
		} else {
			throw new Error(`[${bearer.error}]: ${bearer.message}`);
		}
	}

	private getAccessTokenRequestURL() : string {
		return `https://id.twitch.tv/oauth2/token?client_id=` +
			`${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}` +
			`&grant_type=client_credentials&scope=${this.body.getScope()}`;
	}
}