import TestTwitchRequest from "../fakes/TestTwitchRequest";
import TwitchSubscription from "../../src/twitch/TwitchSubscription";
import SubscriptionBody from "../../src/schemas/request/SubscriptionBody";
import FakeRequestBuilder from "../fakes/FakeRequestBuilder";
import FakeSecretGenerator from "../fakes/FakeSecretGenerator";
import { Response, Headers } from "node-fetch";
import TwitchResponse from "../../src/twitch/TwitchResponse";
import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";

describe('send()', () => {
	test('Should fail to get OAuth token for the request', async () => {
		const body : SubscriptionBody = new SubscriptionBody({
			callbackURL: "",
			userID: 1
		});
		const subscription : TwitchSubscription = new TwitchSubscription(body, "user", "foo");
		const builder : FakeRequestBuilder = new FakeRequestBuilder();
		const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);
		
		await expect(request.send()).rejects.toEqual(new Error("Request Failed"));
	});

	test('Should fail to get OAuth token for the request due to error with request', async () => {
		const body : SubscriptionBody = new SubscriptionBody({
			callbackURL: "",
			userID: 1
		});
		const subscription : TwitchSubscription = new TwitchSubscription(body, "user", "foo");
		const builder : FakeRequestBuilder = new FakeRequestBuilder();
		const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);

		builder.queueResponse(new Response(JSON.stringify({
			error: "error",
			message: "message",
			status: 400
		}), {
			status: 400
		}));

		await expect(request.send()).rejects.toEqual(new Error("[error]: message"));
	});

	test('Should successfully send authorized request', async () => {
		const body : SubscriptionBody = new SubscriptionBody({
			callbackURL: "",
			userID: 1
		});

		const subscription : TwitchSubscription = new TwitchSubscription(body, "user", "foo");
		const builder : FakeRequestBuilder = new FakeRequestBuilder();
		const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);

		queueBearerResponse(builder);
		builder.queueResponse(new Response("", {
			status: 202
		}));

		const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
		await expect(request.send()).resolves.toEqual(new TwitchResponse({
			headers: new Headers({
				"Client-ID": clientID === undefined ? "" : clientID,
				"Content-Type": "application/json",
				"Authorization": 'Bearer asdfasdf'
			}),
			body: new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")).getBody(),
			method: "POST"
		}, new Response("", {
			status: 202
		})));
	});

	test('Should successfully send unauthorized request', async () => {
		const body : SubscriptionBody  = new SubscriptionBody({
			callbackURL: "",
			userID: 1
		});
		const subscription : TwitchSubscription = new TwitchSubscription(body, "streams", "foo");
		const builder : FakeRequestBuilder = new FakeRequestBuilder();
		const request : TestTwitchRequest = new TestTwitchRequest(subscription, builder);

		builder.queueResponse(new Response("", {
			status: 202
		}));
		
		const clientID : string | undefined = process.env.TWITCH_CLIENT_ID;
		await expect(request.send()).resolves.toEqual(new TwitchResponse({
			headers: new Headers({
				"Client-ID": clientID === undefined ? "" : clientID,
				"Content-Type": "application/json",
			}),
			body: new TwitchWebhookRequestBody(subscription, new FakeSecretGenerator("secret")).getBody(),
			method: "POST"
		}, new Response("", {
			status: 202
		})));
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
		scope: "user_read_email"
	});
}