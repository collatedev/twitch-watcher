import SubscriptionBody from "../schemas/request/SubscriptionBody";
import SubscribeRequest from './SubscribeRequest';
import TwitchSubscription from './TwitchSubscription';
import HTTPRequestBuilder from '../request_builder/HTTPRequestBuilder';
import IRequestBuilder from "../request_builder/IRequestBuilder";
import StatusCodes from "../routes/StatusCodes";
import TwitchTopics from "./TwitchTopics";
import TwitchCallbackURL from "./TwitchCallbackURL";
import { ILogger } from "@collate/logging";
import ISecretGenerator from "./ISecretGenerator";
import ITwitchRequest from "./ITwitchRequest";
import ITwitchResponse from "./ITwitchResponse";
import ITwitchService from "./ITwitchService";

type PendingTwitchResponse = Promise<ITwitchResponse>;

export default class TwitchService implements ITwitchService {
	private requestBuilder : IRequestBuilder = new HTTPRequestBuilder();
	private logger : ILogger;
	private secretGenerator : ISecretGenerator;

	constructor(requestBuilder : IRequestBuilder, secretGenerator : ISecretGenerator, logger : ILogger) {
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

	private async makeRequests(requests: ITwitchRequest[]) : Promise<void> {
		const messages : PendingTwitchResponse[] = this.sendRequests(requests);	
		const responses : ITwitchResponse[] = await Promise.all(messages);
		this.validateResponses(responses);
	}

	private validateResponses(responses: ITwitchResponse[]) : void {
		for (const response of responses) {
			if (response.response().status !== StatusCodes.Accepted) {
				throw new Error(`Failed to subscribe to ${response.request().body}`);
			}
		}
	}

	private sendRequests(requests: ITwitchRequest[]) : PendingTwitchResponse[] {
		const messages : PendingTwitchResponse[] = [];
		for (const request of requests) {
			messages.push(request.send());
		}
		return messages;
	}
}