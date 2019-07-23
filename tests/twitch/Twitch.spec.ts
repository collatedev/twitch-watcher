import Twitch from "../../src/twitch/Twitch";
import FakeRequesetBuilder from "../fakes/FakeRequestBuilder";
import SubscriptionBody from '../../src/schemas/request/SubscriptionBody';
import { Response } from 'node-fetch';
import StatusCodes from '../../src/routes/StatusCodes';
import TwitchWebhookRequestBody from "../../src/twitch/TwitchWebhookRequestBody";
import FakeSecretGenerator from "../fakes/FakeSecretGenerator";

const WebhookCount : number = 4;

describe('subscribe', () => {
	test('Should send all subscriptions successfully', async () => {
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.Accepted);
		Twitch.RequestBuilder = requestBuilder;
		
		await Twitch.subscribe(new SubscriptionBody({
			callbackURL: "",
			userID: 123
		}));
	});

	test('Should fail to send request due to bad request statuses', async () => {
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.BadRequest);
		Twitch.RequestBuilder = requestBuilder;
		TwitchWebhookRequestBody.SecretGenerator = new FakeSecretGenerator("secret");

		await expect(Twitch.subscribe(new SubscriptionBody({
			callbackURL: "",
			userID: 123
		}))).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"subscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=123","hub.secret":"secret","hub.callba` +
			`ck":"https://a368d28e.ngrok.io/api/v1/topic/follow/new","hub.lease_seconds":864000}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		Twitch.RequestBuilder = requestBuilder;

		await expect(Twitch.subscribe(new SubscriptionBody({
			callbackURL: "",
			userID: 123
		}))).rejects.toEqual(new Error("Request Failed"));
	});
});

function queueBearerResponse(builder: FakeRequesetBuilder) : void {
	builder.queueResponse(new Response(getAuthorizationBearer(), {
		status: 200
	}));
}

function queueAuthorizationResponses(builder: FakeRequesetBuilder, status: number) : void {
	for (let i : number = 0; i < WebhookCount; i++) {
		builder.queueResponse(new Response("", { status }));
	}
}

function getAuthorizationBearer(): string {
	return JSON.stringify({
		access_token: "asdfasdf",
		refresh_token: "eyJfMzUtNDU0OC04MWYwLTQ5MDY5ODY4NGNlMSJ9%asdfasdf=",
		scope: "user_read_email"
	});
}