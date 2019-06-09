import TwitchRequest from "./TwitchRequest";
import TwitchSubscription from "./TwitchSubscription";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: IRequestBuilder) {
		subscription.mode = "subscribe";
		super(new TwitchWebhookRequestBody(subscription), requestBuilder);
	}
}