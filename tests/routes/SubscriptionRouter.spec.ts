import SubscriptionRouter from "../../src/routes/SubscriptionRouter";
import { use, expect } from 'chai';
import 'mocha';
import FakeUserModel from "../mocks/FakeUserModel";
import { mockReq, mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import FakeUserLayer from "../mocks/FakeUserLayer";
import TwitchUser from "../../src/schemas/user/TwitchUser";
import TwitchWebhook from "../../src/schemas/user/TwitchWebhook";
import StatusCodes from "../../src/routes/StatusCodes";

use(sinonChai);

describe('Subscription Router', () => {
	describe('setup', () => {
		const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
		
		try {
			router.setup();
		} catch(error) {
			throw error;
		}
	});

    describe('handleSubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq();
            const response : any = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch (error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Subscription Body is missing property: 'callbackURL' it is either null or undefined")
            );
        });

        it(`Should fail because the body does not contain a callback URL`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq({
                body: {
                    topic: "",
                    userID: 1
                }
            });
            const response : any = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Subscription Body is missing property: 'callbackURL' it is either null or undefined")
            );
        });

        it(`Should fail because the body does not contain a user ID`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq({
                body: {
                    callbackURL: "",
                    topic: ""
                }
            });
            const response : any = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Subscription Body is missing property: 'userID' it is either null or undefined")
            );
        });

        it(`Should fail because the userID is unknown`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topic",
                    userID: 1
                }
            });
            const response : any = mockRes();

            try {
				await router.handleSubscription(request, response);
			} catch (error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.InternalError);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to subscribe user to webhook")
            );
        });

        it(`Should get user information with the subscription updated`, async() => {
            const userModel : FakeUserModel = new FakeUserModel();
            userModel.addUser(1);
            const router : any = new SubscriptionRouter(new FakeUserLayer(userModel));
            const request : any = mockReq({
                body: {
                    callbackURL: "callbackURL",
                    topic: "topic",
                    userID: 1
                }
            });
            const response : any = mockRes();
            const expectedUser : TwitchUser = new TwitchUser(1);
            expectedUser.followerHook = new TwitchWebhook("callbackURL", "topic", null);

            try {
				await router.handleSubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.OK);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        });
    });

    describe('handleUnsubscription', () => {
        it(`Should fail because the body is empty`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq();
            const response : any = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Unsubscription Body has a null or undefined value on the 'userID' field")
            );
        });

        it(`Should fail because the body does not contain a user ID`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq({
                body: {
                    topic: ""
                }
            });
            const response : any = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Unsubscription Body has a null or undefined value on the 'userID' field")
            );
        });

        it(`Should fail because the userID is unknown`, async () => {
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(new FakeUserModel()));
            const request : any = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            const response : any = mockRes();

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.InternalError);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to unsubscribe user from webhook")
            );
        });

        it(`Should get user information with the subscription updated`, async() => {
            const userModel : FakeUserModel = new FakeUserModel();
            userModel.addUser(1);
            const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(userModel));
            const request : any = mockReq({
                body: {
                    topic: "topic",
                    userID: 1
                }
            });
            const response : any = mockRes();
            const expectedUser : TwitchUser = new TwitchUser(1);

            try {
				await router.handleUnsubscription(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.OK);
            expect(response.json).to.have.been.calledWith(new DataMessage(expectedUser));
        });
    });
});