import SubscriptionBody from "../schemas/request/SubscriptionBody";
import * as Dotenv from 'dotenv'
import SubscribeRequest from './SubscribeRequest';
import TwitchRequest from './TwitchRequest';
import { Logger } from '../config/Winston';
import TwitchResponse from './TwitchResponse';
import TwitchSubscription from './TwitchSubscription';
import HTTPRequestBuilder from '../request_builder/HTTPRequestBuilder';
import IRequestBuilder from "../request_builder/IRequestBuilder";
Dotenv.config();

export default class Twitch {
	public static RequestBuilder: IRequestBuilder = new HTTPRequestBuilder();
	
	private static readonly Topics : string[] = [
		"follow/new", 
		"follow/followed", 
		"streams", 
		"user"
	];

	public static async subscribe(body: SubscriptionBody) {
		try {
			const requests = this.getRequests(body);
			await this.makeRequests(requests);
			Logger.info(`Successfully completed Twich subscription requests to all topics for user (id=${body.userID}) to all webhooks`);	
		} catch (error) {
			throw error;
		}
	}

	private static getRequests(body: SubscriptionBody) {
		const requests: SubscribeRequest[] = [];
		for (const topic of this.Topics) {
			requests.push(new SubscribeRequest(
				new TwitchSubscription(body, topic), 
				this.RequestBuilder
			));
		}
		return requests;
	}

	private static async makeRequests(requests: TwitchRequest[]) {
		const messages : Array<Promise<TwitchResponse>> = this.sendRequests(requests);	
		const responses = await Promise.all(messages);
		for (const response of responses) {
			if (response.HTTPResponse.status !== 202) {
				throw new Error(`Failed to subscribe to ${response.request.body}`);
			}
		}
	}

	private static sendRequests(requests: TwitchRequest[]) {
		const messages : Array<Promise<TwitchResponse>> = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}
}