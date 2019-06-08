import "mocha";
import { expect } from "chai";
import TwitchRequestBody from "../../src/twitch/TwitchRequestBody";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";

describe("TwitchRequestBody", () => {
	it("Should be legally constructed", () => {
		const body : TwitchRequestBody = new TwitchRequestBody(new TwitchSubscription({
			userID: 1
		}, "streams", "foo"));

		expect(body).to.not.equal(null);
	});

	it("Should be illegally constructed", () => {
		function createRequestBody() : TwitchRequestBody {
			return new TwitchRequestBody(new TwitchSubscription({
				userID: 1
			}, "illegal", "foo"));
		}

		expect(createRequestBody.bind(null)).to.throw(`Unknown topic: 'illegal'`);
	});
});