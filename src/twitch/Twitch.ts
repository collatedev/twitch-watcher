import SubscriptionBody from "../schemas/request/SubscriptionBody";
import * as Dotenv from 'dotenv';
import SubscribeRequest from './SubscribeRequest';
import TwitchRequest from './TwitchRequest';
import { Logger } from '../config/Winston';
import TwitchResponse from './TwitchResponse';
import TwitchSubscription from './TwitchSubscription';
import HTTPRequestBuilder from '../request_builder/HTTPRequestBuilder';
import IRequestBuilder from "../request_builder/IRequestBuilder";
import StatusCodes from "../routes/StatusCodes";
Dotenv.config();

export default class Twitch {
	public static RequestBuilder : IRequestBuilder = new HTTPRequestBuilder();
	
	private static readonly Topics : string[] = [
		"follow/new", 
		"follow/followed", 
		"streams", 
		"user"
	];

	public static async subscribe(body: SubscriptionBody) : Promise<void> {
		try {
			const requests : SubscribeRequest[] = this.getRequests(body);
			await this.makeRequests(requests);
			Logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${body.userID}) to all webhooks`
			);	
		} catch (error) {
			throw error;
		}
	}

	private static getRequests(body: SubscriptionBody) : SubscribeRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of this.Topics) {
			requests.push(new SubscribeRequest(
				new TwitchSubscription(body, topic), 
				this.RequestBuilder
			));
		}
		return requests;
	}

	private static async makeRequests(requests: TwitchRequest[]) : Promise<void> {
		const messages : Array<Promise<TwitchResponse>> = this.sendRequests(requests);	
		const responses : TwitchResponse[] = await Promise.all(messages);
		this.validateResponses(responses);
	}

	private static validateResponses(responses: TwitchResponse[]) : void {
		for (const response of responses) {
			if (response.HTTPResponse.status !== StatusCodes.Accepted) {
				throw new Error(`Failed to subscribe to ${response.request.body}`);
			}
		}
	}

	private static sendRequests(requests: TwitchRequest[]) : Array<Promise<TwitchResponse>> {
		const messages : Array<Promise<TwitchResponse>> = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}
}