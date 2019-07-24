import UserRouter from "../../src/routes/UserRouter";
import FakeUserModel from "../fakes/FakeUserModel";
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import StatusCodes from "../../src/routes/StatusCodes";
import mockResponse from '../mocks/mockResponse';
import mockRequest from '../mocks/mockRequest';
import IRouteHandler from "../../src/routes/IRouteHandler";
import FakeLogger from "../fakes/FakeLogger";
import { ILogger } from "@collate/logging";
import FakeUserLayer from "../fakes/FakeUserLayer";
import IUserLayer from "../../src/layers/IUserLayer";

const logger : ILogger = new FakeLogger();

describe("validate() [middleware]", () => {
	test('Should fail to validate due to incorrect type', (done : any) => {
        const router : UserRouter = new UserRouter(new FakeUserLayer(new FakeUserModel()), logger);
        router.setup();
		const request : any = mockRequest({
            params: {
                userID: "string"
            }
        });
		const response : any = mockResponse();
	
		const middleWare : IRouteHandler = router.validate(router.getSchema());
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "params.userID",
						message: "Property 'userID' should be type 'number'",
					}
				])
			);
			done();
		});
    });
    
    test('Should fail due to a float userID [TODO]', async () => {
        // Need to update sanitizer to ensure that only integers can be passed
    });
});

describe('handleGetUserByID()', () => {
    test('Should fail because user does not exist', async () => {
        const router : UserRouter = new UserRouter(new FakeUserLayer(new FakeUserModel()), logger);
        router.setup();
        const request : any = mockRequest({
            params: {
                userID: 1
            }
        });
        const response : any = mockResponse();

        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.NotFound);
        expect(response.json).toHaveBeenCalledWith(
            new ErrorMessage("Failed to get user with id: 1")
        );
    });

    test('Should get user data', async () => {
        const twitchModel : FakeUserModel = new FakeUserModel();
        const userLayer : IUserLayer = new FakeUserLayer(twitchModel);
        const router : UserRouter = new UserRouter(userLayer, logger);
        router.setup();
        const request : any = mockRequest({
            params: {
                userID: 1
            }
        });
        const response : any = mockResponse();
        twitchModel.addUser(1);

        await router.handleGetUserByID(request, response);

        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.json).toHaveBeenCalledWith(
            new DataMessage(await twitchModel.getByID(1))
        );
    });
});
	