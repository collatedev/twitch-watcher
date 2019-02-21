import SubscriptionRouter from "../../src/routes/SubscriptionRouter"
import { use, expect } from 'chai';
import 'mocha';
import FakeUserModel from "../mocks/FakeUserModel";
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import FakeUserLayer from "../mocks/FakeUserLayer";
import TwitchUser from "../../src/schemas/user/TwitchUser";
import TwitchWebhook from "../../src/schemas/user/TwitchWebhook";

use(sinonChai);

describe('Subscription Router', () => {
	describe('setup', () => {
		const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
		
		try {
			router.setup();
		} catch(error) {
			throw error;
		}
	})

    describe('handleSubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq();
            const response = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch (error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body is missing property: 'callbackURL' it is either null or undefined")
            );
        })

        it(`Should fail because the body does not contain a callback URL`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq({
                body: {
                    topic: "",
                    userID: 1
                }
            });
            const response = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body is missing property: 'callbackURL' it is either null or undefined")
            );
        })

        it(`Should fail because the body does not contain a user ID`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq({
                body: {
                    callbackURL: "",
                    topic: ""
                }
            });
            const response = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body is missing property: 'userID' it is either null or undefined")
            );
        })

        it(`Should fail because the userID is unknown`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topci",
                    userID: 1
                }
            });
            const response = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch (error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to subscribe user to webhook")
            );
        })

        it(`Should get user information with the subscription updated`, async() => {
            const userModel = new FakeUserModel();
            userModel.addUser(1);
            const router = new SubscriptionRouter(new FakeUserLayer(userModel));
            const request = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topic",
                    userID: 1
                }
            });
            const response = mockRes();
            const expectedUser = new TwitchUser(1);
            expectedUser.followerHook = new TwitchWebhook("callbackURL", "topic", null);

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        })
    })

    describe('handleUnsubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq();
            const response = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body is missing property: 'userID' it is either null or undefined")
            );
        })

        it(`Should fail because the body does not contain a user ID`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq({
                body: {
                    topic: ""
                }
            });
            const response = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body is missing property: 'userID' it is either null or undefined")
            );
        })

        it(`Should fail because the userID is unknown`, async () => {
            const router = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            const response = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to unsubscribe user from webhook")
            );
        })

        it(`Should get user information with the subscription updated`, async() => {
            const userModel = new FakeUserModel();
            userModel.addUser(1);
            const router = new SubscriptionRouter(new FakeUserLayer(userModel));
            const request = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            const response = mockRes();
            const expectedUser = new TwitchUser(1);

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        })
    })
})