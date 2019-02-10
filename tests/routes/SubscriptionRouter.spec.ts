import SubscriptionRouter from "../../src/routes/SubscriptionRouter"
import { use, expect } from 'chai';
import 'mocha';
import FakeUserModel from "../mocks/FakeUserModel";
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import UserLayer from "../../src/layers/UserLayer";
import FakeUserLayer from "../mocks/FakeUserLayer";
import TwitchUser from "../../src/schemas/TwitchUser";
import TwitchWebhook from "../../src/schemas/TwitchWebhook";

use(sinonChai);

describe('Subscription Router', () => {
    describe('handleSubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq();
            let response = mockRes();

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must not be empty")
            );
        })

        it(`Should fail because the body does not contain a topic`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    callbackURL: "",
                    userID: 1
                }
            });
            let response = mockRes();

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must contain a topic field")
            );
        })

        it(`Should fail because the body does not contain a callback URL`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    topic: "",
                    userID: 1
                }
            });
            let response = mockRes();

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must contain a callbackURL field")
            );
        })

        it(`Should fail because the body does not contain a user ID`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    callbackURL: "",
                    topic: ""
                }
            });
            let response = mockRes();

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must contain a userID field")
            );
        })

        it(`Should fail because the userID is unknown`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topci",
                    userID: 1
                }
            });
            let response = mockRes();

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to subscribe user to webhook")
            );
        })

        it(`Should get user information with the subscription updated`, async() => {
            let userModel = new FakeUserModel();
            userModel.addUser(1);
            let router = new SubscriptionRouter(new FakeUserLayer(userModel));
            let request = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topic",
                    userID: 1
                }
            });
            let response = mockRes();
            let expectedUser = new TwitchUser(1);
            expectedUser.followerHook = new TwitchWebhook("callbackURL", "topic", null);

            await router.handleSubscription(request, response);

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        })
    })

    describe('handleUnsubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq();
            let response = mockRes();

            await router.handleUnsubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must not be empty")
            );
        })

        it(`Should fail because the body does not contain a topic`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    userID: 1
                }
            });
            let response = mockRes();

            await router.handleUnsubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must contain a topic field")
            );
        })

        it(`Should fail because the body does not contain a user ID`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    topic: ""
                }
            });
            let response = mockRes();

            await router.handleUnsubscription(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Body must contain a userID field")
            );
        })

        it(`Should fail because the userID is unknown`, async () => {
            let router = new SubscriptionRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            let response = mockRes();

            await router.handleUnsubscription(request, response);

            expect(response.status).to.have.been.calledWith(500);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to unsubscribe user from webhook")
            );
        })

        it(`Should get user information with the subscription updated`, async() => {
            let userModel = new FakeUserModel();
            userModel.addUser(1);
            let router = new SubscriptionRouter(new FakeUserLayer(userModel));
            let request = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            let response = mockRes();
            let expectedUser = new TwitchUser(1);

            await router.handleUnsubscription(request, response);

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        })
    })
})