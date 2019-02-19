import SubscriptionBody from "../schemas/request/SubscriptionBody";
import * as Dotenv from 'dotenv'
import SubscribeRequest from './SubscribeRequest';
import TwitchRequest from './TwitchRequest';
import { Logger } from '../config/Winston';
import TwitchResponse from './TwitchResponse';
import TwitchSubscription from './TwitchSubscription';
import HTTPRequestBuilder from '../http/HTTPRequestBuilder';
Dotenv.config();

export default class Twitch {
	private static readonly Topics : Array<string> = ["follow/new", "follow/followed", "streams", "user"];
	public static RequestBuilder: HTTPRequestBuilder = new HTTPRequestBuilder();

	public static async subscribe(body: SubscriptionBody) {
		let requests = this.Topics.map((topic: string) => {
			return new SubscribeRequest(
				new TwitchSubscription(body, topic), 
				this.RequestBuilder
			);
		});
		try {
			await this.makeRequests(requests);
			Logger.info(`Successfully completed Twich subscription requests to all topics for user (id=${body.userID}) to all webhooks`);	
		} catch (error) {
			Logger.error(error);
			throw error;
		}
		
	}

	private static async makeRequests(requests: TwitchRequest[]) {
		let messages : Promise<TwitchResponse>[] = requests.map((request) => {
			return request.send();
		});
		let twitchResponses = await this.getResponses(messages);
		twitchResponses.forEach(async (twitchResponse: TwitchResponse) => {
			if (twitchResponse.HTTPResponse.status != 202) {
				throw new Error(`Failed to subscribe to ${twitchResponse.request.body}`);
			}
		});
	}

	private static async getResponses(messages: Promise<TwitchResponse>[]): Promise<TwitchResponse[]> {
		try {
			return await Promise.all(messages);
		} catch (error) {
			throw error;
		}
	}
}