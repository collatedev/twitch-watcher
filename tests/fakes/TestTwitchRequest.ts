import TwitchRequest from "../../src/twitch/TwitchRequest";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";
import IRequestBuilder from "../../src/request_builder/IRequestBuilder";
import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";
import FakeSecretGenerator from "./FakeSecretGenerator";

export default class TestTwitchRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: IRequestBuilder) {
		super(new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")), requestBuilder);
	}
}