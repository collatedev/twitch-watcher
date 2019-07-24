import TwitchRequest from "./TwitchRequest";
import TwitchSubscription from "./TwitchSubscription";
import TwitchWebhookRequestBody from "./TwitchWebhookRequestBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";
import SecretGenerator from "./SecretGenerator";

export default class SubscribeRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: IRequestBuilder, secretGenerator : SecretGenerator) {
		subscription.mode = "subscribe";
		super(new TwitchWebhookRequestBody(subscription, secretGenerator), requestBuilder);
	}
}