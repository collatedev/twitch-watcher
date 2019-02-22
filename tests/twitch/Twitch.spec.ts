import { use, expect, should } from 'chai';
import 'mocha';
import Twitch from "../../src/twitch/Twitch";
import FakeRequesetBuilder from "../mocks/FakeRequestBuilder";
import SubscriptionBody from '../../src/schemas/request/SubscriptionBody';
import { Response } from 'node-fetch';
import * as chaiAsPromised from "chai-as-promised";
import StatusCodes from '../../src/routes/StatusCodes';

should();
use(chaiAsPromised);
const WebhookCount : number = 4;

describe('Twitch', () => {
	describe('subscribe', () => {
		it('Should send all subscriptions successfully', async () => {
			const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
			queueBearerResponse(requestBuilder);
			queueAuthorizationResponses(requestBuilder, StatusCodes.Accepted);
			Twitch.RequestBuilder = requestBuilder;

			try {
				await Twitch.subscribe(new SubscriptionBody({
					callbackURL: "",
					userID: 123
				}));
			} catch(error) {
				throw error;
			}
		});

		it('Should fail to send request due to bad request statuses', async () => {
			const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
			queueBearerResponse(requestBuilder);
			queueAuthorizationResponses(requestBuilder, StatusCodes.BadRequest);
			Twitch.RequestBuilder = requestBuilder;

			return expect(Twitch.subscribe(new SubscriptionBody({
				callbackURL: "",
				userID: 123
			})).catch((error : Error) => {
				throw error;
			})).to.eventually.be.rejectedWith(Error);
		});

		it('Should fail to send subscriptions due to a failed request', async () => {
			const requestBuilder : FakeRequesetBuilder = new FakeRequesetBuilder();
			queueBearerResponse(requestBuilder);
			Twitch.RequestBuilder = requestBuilder;

			return expect(Twitch.subscribe(new SubscriptionBody({
				callbackURL: "",
				userID: 123
			})).catch((error : Error) => {
				throw error;
			})).to.eventually.be.rejectedWith("Request Failed");
		});
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