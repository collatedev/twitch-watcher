import ITwitchRequest from "./ITwitchRequest";
import ITwitchBody from "../schemas/request/ITwitchBody";
import TwitchSubscription from "./TwitchSubscription";
import TwitchRequestBody from "./TwitchRequestBody";
import fetch, { RequestInit, Response } from 'node-fetch';
import HTTPRequestBuilder from "../http/HTTPRequestBuilder";
import TwitchResponse from "./TwitchResponse";

export default abstract class TwitchRequest implements ITwitchRequest {
	private readonly TwitchSubscriptionEndpoint = "https://api.twitch.tv/helix/webhooks/hub";
	private requestBuilder : HTTPRequestBuilder;

	private subscription: TwitchSubscription;

	constructor(subscription: TwitchSubscription, requestBuilder: HTTPRequestBuilder) {
		this.requestBuilder = requestBuilder;
		this.subscription = subscription
	}

	public setRequestBuilder(requestBuilder: HTTPRequestBuilder) {
		this.requestBuilder = requestBuilder;
	}

	public async send(): Promise<TwitchResponse> {
		let request: RequestInit = await this.prepareRequest();
		let pendingRequest = this.requestBuilder.makeRequest(
			this.TwitchSubscriptionEndpoint, 
			request
		);
		return this.getTwitchResponsePromise(pendingRequest, request);
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
			let url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user:read:email`
			let response = await fetch(url, {
				method: "POST"
			});
			let bearer = await response.json();
			return bearer.access_token;
		} catch(error) {
			throw Error("Failed to get client OAuth token for subscription header");
		}
	}

	private getTwitchResponsePromise(pendingRequest: Promise<Response>, request: RequestInit) {
		return new Promise<TwitchResponse>((resolve, reject) => {
			pendingRequest.then((response) => {
				resolve(new TwitchResponse(request, response));
			}).catch((error) => {
				reject(error);
			})
		})
	}
}