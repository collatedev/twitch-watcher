import { expect, should, use } from "chai";
import "mocha";
import TestTwitchRequest from "../mocks/TestTwitchRequest";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";
import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";
import FakeRequestBuilder from "../mocks/FakeRequestBuilder";
import FakeSecretGenerator from "../mocks/FakeSecretGenerator";
import { Response, Headers } from "node-fetch";
import * as chaiAsPromised from "chai-as-promised";
import TwitchResponse from "../../src/twitch/TwitchResponse";
import TwitchRequestBody from "../../src/twitch/TwitchRequestBody";

should();
use(chaiAsPromised);

describe("TwitchRequest", () => {
	describe('send', () => {
		it('Should fail to get OAuth token for the request', async () => {
			const body : SubscriptionBody = new SubscriptionBody({
				callbackURL: "",
				userID: 1
			});
			const subscription : TwitchSubscription = new TwitchSubscription(body, "user");
			const builder : FakeRequestBuilder = new FakeRequestBuilder();
			const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);
			
			return expect(request.send().catch((error : Error) => {
				throw error;
			})).to.eventually.be.rejectedWith(
				"Request Failed"
			);
		});

		it('Should fail to get OAuth token for the request due to error with request', async () => {
			const body : SubscriptionBody = new SubscriptionBody({
				callbackURL: "",
				userID: 1
			});
			const subscription : TwitchSubscription = new TwitchSubscription(body, "user");
			const builder : FakeRequestBuilder = new FakeRequestBuilder();
			const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);

			builder.queueResponse(new Response(JSON.stringify({
				error: "error",
				message: "message",
				status: 400
			}), {
				status: 400
			}));
			
			return expect(request.send().catch((error : Error) => {
				throw error;
			})).to.eventually.be.rejectedWith(
				"[error]: message"
			);
		});

		it('Should successfully send authorized request', async () => {
			const body : SubscriptionBody = new SubscriptionBody({
				callbackURL: "",
				userID: 1
			});
			const subscription : TwitchSubscription = new TwitchSubscription(body, "user");
			const builder : FakeRequestBuilder = new FakeRequestBuilder();
			const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);
			TwitchRequestBody.SecretGenerator = new FakeSecretGenerator("secret");

			queueBearerResponse(builder);
			builder.queueResponse(new Response("", {
				status: 202
			}));
			
			const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
			return expect(request.send().catch((error : Error) => {
				throw error;
			})).to.eventually.deep.equal(new TwitchResponse({
				headers: new Headers({
					"Client-ID": clientID === undefined ? "" : clientID,
					"Content-Type": "application/json",
					"Authorization": 'Bearer asdfasdf'
				}),
				body: new TwitchRequestBody(subscription).getBody(),
				method: "POST"
			}, new Response("", {
				status: 202
			})));
		});

		it('Should successfully send unauthorized request', async () => {
			const body : SubscriptionBody  = new SubscriptionBody({
				callbackURL: "",
				userID: 1
			});
			const subscription : TwitchSubscription = new TwitchSubscription(body, "streams");
			const builder : FakeRequestBuilder = new FakeRequestBuilder();
			const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);
			TwitchRequestBody.SecretGenerator = new FakeSecretGenerator("secret");

			builder.queueResponse(new Response("", {
				status: 202
			}));
			
			const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
			return expect(request.send().catch((error : Error) => {
				throw error;
			})).to.eventually.deep.equal(new TwitchResponse({
				headers: new Headers({
					"Client-ID": clientID === undefined ? "" : clientID,
					"Content-Type": "application/json",
				}),
				body: new TwitchRequestBody(subscription).getBody(),
				method: "POST"
			}, new Response("", {
				status: 202
			})));
		});
	});
});

function queueBearerResponse(builder: FakeRequestBuilder) : void {
	builder.queueResponse(new Response(getAuthorizationBearer(), {
		status: 200
	}));
}

function getAuthorizationBearer(): string {
	return JSON.stringify({
		access_token: "asdfasdf",
		refresh_token: null,
		scope: ["user_read_email"]
	});
}