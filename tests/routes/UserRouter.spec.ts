import UserRouter from "../../src/routes/UserRouter"
import { use, expect } from 'chai';
import 'mocha';
import FakeUserModel from "../mocks/FakeUserModel";
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from "../../src/messages/ErrorMessage";
import DataMessage from "../../src/messages/DataMessage";
import UserLayer from "../../src/layers/UserLayer";

use(sinonChai);

describe('User Router', () => {
	describe('setup', () => {
		const router = new UserRouter(new UserLayer(new FakeUserModel()));

		try {
			router.setup();
		} catch (error) {
			throw error;
		}
	})

    describe('getUserByID', () => {
        it('Should fail due to a string userID', async () => {
            const router = new UserRouter(new UserLayer(new FakeUserModel()));
            const request = mockReq({
                params: {
                    userID: "String"
                }
            })
            const response = mockRes();

            try {
				await router.getUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received 'NaN'")
            );
        });

        it('Should fail due to a float userID', async () => {
            const router = new UserRouter(new UserLayer(new FakeUserModel()));
            const request = mockReq({
                params: {
                    userID: 1.1
                }
            })
            const response = mockRes();

            try {
				await router.getUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received '1.1'")
            );
        });

        it('Should fail because user does not exist', async () => {
            const router = new UserRouter(new UserLayer(new FakeUserModel()));
            const request = mockReq({
                params: {
                    userID: 1
                }
            })
            const response = mockRes();

            try {
				await router.getUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(404);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to get user with id: 1")
            );
        });

        it('Should get user data', async () => {
            const twitchModel = new FakeUserModel();
            const userLayer = new UserLayer(twitchModel);
            const router = new UserRouter(userLayer);
            const request = mockReq({
                params: {
                    userID: 1
                }
            })
            const response = mockRes();
            twitchModel.addUser(1);

            try {
				await router.getUserByID(request, response);
			} catch(error) {
				throw error;
			}

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(
				new DataMessage(await twitchModel.getByID(1))
			);
        });
    })
});