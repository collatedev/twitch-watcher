import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : TwitchWebhookRequestBody = new TwitchWebhookRequestBody(new TwitchSubscription({
			userID: 1
		}, "streams", "foo"));

		expect(body).not.toBeNull();
	});

	it("Should be illegally constructed", () => {
		expect(() => {
			return new TwitchWebhookRequestBody(new TwitchSubscription({
				userID: 1
			}, "illegal", "foo"));
		}).toThrow(`Unknown topic: 'illegal'`);
	});
});