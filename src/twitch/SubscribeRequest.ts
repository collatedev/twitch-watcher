import TwitchRequest from "./TwitchRequest";
import TwitchSubscription from "./TwitchSubscription";
import HTTPRequestBuilder from "../http/HTTPRequestBuilder";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: HTTPRequestBuilder) {
		subscription.mode = "subscribe";
		super(subscription, requestBuilder);
	}
}