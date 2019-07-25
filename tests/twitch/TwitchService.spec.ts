import TwitchService from "../../src/twitch/TwitchService";
import FakeRequesetBuilder from "../fakes/FakeRequestBuilder";
import SubscriptionBody from '../../src/schemas/request/SubscriptionBody';
import { Response } from 'node-fetch';
import FakeSecretGenerator from "../fakes/FakeSecretGenerator";
import FakeLogger from "../fakes/FakeLogger";
import { StatusCodes } from "@collate/router";

const WebhookCount : number = 4;

describe('subscribe', () => {
	const OLD_ENV : any = process.env;

	beforeEach(() => {
		jest.resetModules(); // this is important - it clears the cache
		process.env = { ...OLD_ENV };
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});

	test('Should send all subscriptions successfully', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.Accepted);

		const twitch : TwitchService = new TwitchService(requestBuilder, new FakeSecretGenerator("foo"), new FakeLogger());
		
		await twitch.subscribe(new SubscriptionBody({
			callbackURL: "",
			userID: 123
		}));
	});

	test('Should fail to send request due to bad request statuses', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		queueAuthorizationResponses(requestBuilder, StatusCodes.BadRequest);
		const twitch : TwitchService = new TwitchService(requestBuilder, new FakeSecretGenerator("secret"), new FakeLogger());

		await expect(twitch.subscribe(
			new SubscriptionBody({
				callbackURL: "",
				userID: 123
			})
		)).rejects.toEqual(new Error(
			`Failed to subscribe to {"hub.mode":"subscribe","hub.topic":"https://api.twitch.tv/` +
			`helix/users/follows?first=1&to_id=123","hub.secret":"secret","hub.callba` +
			`ck":"endpoint_url/follow/new","hub.lease_seconds":864000}`
		));
	});

	test('Should fail to send subscriptions due to a failed request', async () => {
		process.env.NODE_ENV = "test";
		const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
		queueBearerResponse(requestBuilder);
		const twitch : TwitchService = new TwitchService(requestBuilder, new FakeSecretGenerator("foo"), new FakeLogger());

		await expect(twitch.subscribe(
			new SubscriptionBody({
				callbackURL: "",
				userID: 123
			})
		)).rejects.toEqual(new Error("Request Failed"));
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