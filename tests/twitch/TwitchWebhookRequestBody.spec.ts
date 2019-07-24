import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";
import FakeSecretGenerator from "../fakes/FakeSecretGenerator";

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : TwitchWebhookRequestBody = new TwitchWebhookRequestBody(
			new TwitchSubscription({
				userID: 1
			}, "streams", "foo"),
			new FakeSecretGenerator("secret")
		);

		expect(body).not.toBeNull();
	});

	it("Should be illegally constructed", () => {
		expect(() => {
			return new TwitchWebhookRequestBody(
				new TwitchSubscription({
					userID: 1
				}, "illegal", "foo"),
				new FakeSecretGenerator("secret")
			);
		}).toThrow(`Unknown topic: 'illegal'`);
	});
});