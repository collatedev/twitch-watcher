import UserRouter from "../../src/routes/UserRouter";
import { use, expect } from 'chai';
import 'mocha';
import FakeUserModel from "../mocks/FakeUserModel";
import { mockReq, mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import UserLayer from "../../src/layers/UserLayer";
import StatusCodes from "../../src/routes/StatusCodes";

use(sinonChai);

describe('User Router', () => {
	describe('setup', () => {
		const router : UserRouter = new UserRouter(new UserLayer(new FakeUserModel()));

		try {
			router.setup();
		} catch (error) {
			throw error;
		}
	});

    describe('handleGetUserByID', () => {
        it('Should fail due to a string userID', async () => {
            const router : UserRouter = new UserRouter(new UserLayer(new FakeUserModel()));
            const request : any = mockReq({
                params: {
                    userID: "String"
                }
            });
            const response : any = mockRes();

            try {
				await router.handleGetUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received 'NaN'")
            );
        });

        it('Should fail due to a float userID', async () => {
            const router : UserRouter = new UserRouter(new UserLayer(new FakeUserModel()));
            const request : any = mockReq({
                params: {
                    userID: 1.1
                }
            });
            const response : any = mockRes();

            try {
				await router.handleGetUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received '1.1'")
            );
        });

        it('Should fail because user does not exist', async () => {
            const router : UserRouter = new UserRouter(new UserLayer(new FakeUserModel()));
            const request : any = mockReq({
                params: {
                    userID: 1
                }
            });
            const response : any = mockRes();

            try {
				await router.handleGetUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.NotFound);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to get user with id: 1")
            );
        });

        it('Should get user data', async () => {
            const twitchModel : FakeUserModel = new FakeUserModel();
            const userLayer : UserLayer = new UserLayer(twitchModel);
            const router : UserRouter = new UserRouter(userLayer);
            const request : any = mockReq({
                params: {
                    userID: 1
                }
            });
            const response : any = mockRes();
            twitchModel.addUser(1);

            try {
				await router.handleGetUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(StatusCodes.OK);
            expect(response.json).to.have.been.calledWith(
				new DataMessage(await twitchModel.getByID(1))
			);
        });
    });
});