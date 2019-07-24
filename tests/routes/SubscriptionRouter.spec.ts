import SubscriptionRouter from "../../src/routes/SubscriptionRouter";
import FakeUserModel from "../fakes/FakeUserModel";
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import FakeUserLayer from "../fakes/FakeUserLayer";
import TwitchUser from "../../src/schemas/user/TwitchUser";
import TwitchWebhook from "../../src/schemas/user/TwitchWebhook";   
import StatusCodes from "../../src/routes/StatusCodes";
import mockResponse from '../mocks/mockResponse';
import mockRequest from '../mocks/mockRequest';
import IRouteHandler from "../../src/routes/IRouteHandler";
import SubscriptonSchema from "../../src/api/SubscriptionRequest.json";
import { ValidationSchema } from "@collate/request-validator";
import FakeLogger from "../fakes/FakeLogger";
import { ILogger } from "@collate/logging";

const logger : ILogger = new FakeLogger();

describe("validate() [middleware]", () => {
	test(`Should fail because the body is empty`, async (done : any) => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new FakeUserLayer(new FakeUserModel()), 
            logger
        );
        router.setup();
        const request : any = mockRequest({});
        const response : any = mockResponse();
	
		const middleWare : IRouteHandler = router.validate(new ValidationSchema(SubscriptonSchema));
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "",
						message: "Missing property 'body'",
					}
				])
			);
			done();
		});
    });
    
    test(`Should fail because the body does not contain a user ID`, async (done : any) => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new FakeUserLayer(new FakeUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                foo: "bar"
            }
        });
        const response : any = mockResponse();

        const middleWare : IRouteHandler = router.validate(new ValidationSchema(SubscriptonSchema));
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "body",
						message: "Missing property 'userID'",
                    },
                    {
						location: "body",
						message: "Unexpected property 'foo'",
					}
				])
			);
			done();
		});
    });
});

describe('handleSubscription', () => {
    test(`Should fail because the userID is unknown`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new FakeUserLayer(new FakeUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                callbackURL: "callbackURL",
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleSubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to subscribe user to webhook")
        );
    });

    test(`Should get user information with the subscription updated`, async() => {
        const userModel : FakeUserModel = new FakeUserModel();
        userModel.addUser(1);
        const router : any = new SubscriptionRouter(new FakeUserLayer(userModel), logger);
        router.setup();
        const request : any = mockRequest({
            body: {
                callbackURL: "callbackURL",
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();
        const expectedUser : TwitchUser = new TwitchUser(1);
        expectedUser.followerHook = new TwitchWebhook("callbackURL", "topic", null);

        await router.handleSubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(expectedUser));
    });
});

describe('handleUnsubscription', () => {
    test(`Should fail because the userID is unknown`, async () => {
        const router : SubscriptionRouter = new SubscriptionRouter(
            new FakeUserLayer(new FakeUserModel()),
            logger
        );
        router.setup();
        const request : any = mockRequest({
            body: {
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleUnsubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to unsubscribe user from webhook")
        );
    });

    test(`Should get user information with the subscription updated`, async() => {
        const userModel : FakeUserModel = new FakeUserModel();
        const router : SubscriptionRouter = new SubscriptionRouter(new FakeUserLayer(userModel), logger);
        userModel.addUser(1);
        router.setup();
        const request : any = mockRequest({
            body: {
                topic: "topic",
                userID: 1
            }
        });
        const response : any = mockResponse();
        const expectedUser : TwitchUser = new TwitchUser(1);

        await router.handleUnsubscription(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(new DataMessage(expectedUser));
    });
});