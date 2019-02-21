import TwitchRequest from "../../src/twitch/TwitchRequest";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";
import IRequestBuilder from "../../src/request_builder/IRequestBuilder";

export default class TestTwitchRequest extends TwitchRequest {
	constructor(subscription: TwitchSubscription, requestBuilder: IRequestBuilder) {
		super(subscription, requestBuilder)
	}
}