import "mocha";
import { expect } from "chai";
import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : TwitchWebhookRequestBody = new TwitchWebhookRequestBody(new TwitchSubscription({
			userID: 1
		}, "streams", "foo"));

		expect(body).to.not.equal(null);
	});

	it("Should be illegally constructed", () => {
		function createRequestBody() : TwitchWebhookRequestBody {
			return new TwitchWebhookRequestBody(new TwitchSubscription({
				userID: 1
			}, "illegal", "foo"));
		}

		expect(createRequestBody.bind(null)).to.throw(`Unknown topic: 'illegal'`);
	});
});