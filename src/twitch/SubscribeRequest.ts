import TwitchRequest from "./TwitchRequest";
import TwitchSubscription from "./TwitchSubscription";
import HTTPRequestBuilder from "../request_builder/HTTPRequestBuilder";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: HTTPRequestBuilder) {
		subscription.mode = "subscribe";
		super(subscription, requestBuilder);
	}
}