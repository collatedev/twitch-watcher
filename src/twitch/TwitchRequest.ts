import ITwitchRequest from "./ITwitchRequest";
import TwitchSubscription from "./TwitchSubscription";
import TwitchRequestBody from "./TwitchRequestBody";
import { RequestInit } from 'node-fetch';
import HTTPRequestBuilder from "../request_builder/HTTPRequestBuilder";
import TwitchResponse from "./TwitchResponse";
import TwitchOAuthBearer from "../schemas/request/TwitchOAuthBearer";
import PartialValidator from "../validators/PartialValidator";

export default abstract class TwitchRequest implements ITwitchRequest {
	private readonly TwitchSubscriptionEndpoint = "https://api.twitch.tv/helix/webhooks/hub";
	
	private requestBuilder : HTTPRequestBuilder;
	private tokenValidator : PartialValidator<TwitchOAuthBearer>;
	private subscription: TwitchSubscription;

	constructor(subscription: TwitchSubscription, requestBuilder: HTTPRequestBuilder) {
		this.requestBuilder = requestBuilder;
		this.subscription = subscription
		this.tokenValidator = new PartialValidator<TwitchOAuthBearer>("Token", [
			"accessToken", 
			"scope"
		])
	}

	public send(): Promise<TwitchResponse> {
		return new Promise<TwitchResponse>(async (resolve, reject) => {
			try {
				const request: RequestInit = await this.prepareRequest();
				this.requestBuilder.makeRequest(
					this.TwitchSubscriptionEndpoint, 
					request
				).then((response) => {
					return resolve(new TwitchResponse(request, response));
				}).catch((error) => {
					return reject(error);
				});
			} catch (error) {
				return reject(error);
			}
		})
	}

	private async prepareRequest() {
		return {
			headers: await this.getHeaders(),
			body: new TwitchRequestBody(this.subscription).getBody(),
			method: "POST"
		}
	}

	private async getHeaders(): Promise<any> {
		if (this.subscription.authorizationRequired) {
			return {
				"Client-ID": process.env.TWITCH_CLIENT_ID,
				"Content-Type": "application/json",
				"Authorization": `Bearer ${await this.getOAuthToken()}`
			}
		} else {
			return {
				"Client-ID":process.env.TWITCH_CLIENT_ID,
				"Content-Type": "application/json"
			}
		}
	}

	private async getOAuthToken(): Promise<string> {
		try {
			return await this.handleOAuthToken();
		} catch(error) {
			throw error;
		}
	}

	private async handleOAuthToken() {
		const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=${this.subscription.scope}`
		const response = await this.requestBuilder.makeRequest(url, { method: "POST" });
		const bearer = new TwitchOAuthBearer(await response.json());
		if (this.tokenValidator.isValid(bearer)) {
			return bearer.accessToken;
		} else {
			throw new Error(`[${bearer.error}]: ${bearer.message}`);
		}
	}
}