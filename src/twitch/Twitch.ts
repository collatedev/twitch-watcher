import SubscriptionBody from "../schemas/request/SubscriptionBody";
import SubscribeRequest from './SubscribeRequest';
import TwitchRequest from './TwitchRequest';
import TwitchResponse from './TwitchResponse';
import TwitchSubscription from './TwitchSubscription';
import HTTPRequestBuilder from '../request_builder/HTTPRequestBuilder';
import IRequestBuilder from "../request_builder/IRequestBuilder";
import StatusCodes from "../routes/StatusCodes";
import TwitchTopics from "./TwitchTopics";
import TwitchCallbackURL from "./TwitchCallbackURL";
import { ILogger, Logger } from "@collate/logging";
import SecretGenerator from "./SecretGenerator";

type PendingTwitchResponse = Promise<TwitchResponse>;

export default class Twitch {
	private requestBuilder : IRequestBuilder = new HTTPRequestBuilder();
	private logger : ILogger = new Logger('info', 'twitch.log');
	private secretGenerator : SecretGenerator;

	constructor(requestBuilder : IRequestBuilder, secretGenerator : SecretGenerator, logger : ILogger) {
		this.requestBuilder = requestBuilder;
		this.logger = logger;
		this.secretGenerator = secretGenerator;
	}

	public async subscribe(body: SubscriptionBody) : Promise<void> {
		try {
			const callbackURL : string = await TwitchCallbackURL.getCallbackURL();
			const requests : SubscribeRequest[] = this.getRequests(body, callbackURL);
			await this.makeRequests(requests);
			this.logger.info(
				`Successfully completed Twich subscription requests to all topics for user (id=${body.userID}) to all webhooks`
			);	
		} catch (error) {
			throw error;
		}
	}

	private getRequests(body: SubscriptionBody, callbackURL: string) : SubscribeRequest[] {
		const requests : SubscribeRequest[] = [];
		for (const topic of TwitchTopics) {
			requests.push(new SubscribeRequest(
				new TwitchSubscription(body, topic, callbackURL), 
				this.requestBuilder,
				this.secretGenerator
			));
		}
		return requests;
	}

	private async makeRequests(requests: TwitchRequest[]) : Promise<void> {
		const messages : PendingTwitchResponse[] = this.sendRequests(requests);	
		const responses : TwitchResponse[] = await Promise.all(messages);
		this.validateResponses(responses);
	}

	private validateResponses(responses: TwitchResponse[]) : void {
		for (const response of responses) {
			if (response.HTTPResponse.status !== StatusCodes.Accepted) {
				throw new Error(`Failed to subscribe to ${response.request.body}`);
			}
		}
	}

	private sendRequests(requests: TwitchRequest[]) : PendingTwitchResponse[] {
		const messages : PendingTwitchResponse[] = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}
}