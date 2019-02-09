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
    describe('getUserByID', () => {
        it('Should fail due to a string userID', async () => {
            let router = new UserRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                params: {
                    userID: "String"
                }
            })
            let response = mockRes();

            await router.getUserByID(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received 'NaN'")
            );
        });

        it('Should fail due to a float userID', async () => {
            let router = new UserRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                params: {
                    userID: 1.1
                }
            })
            let response = mockRes();

            await router.getUserByID(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be a positive integer value, instead received '1.1'")
            );
        });

        it('Should fail because user does not exist', async () => {
            let router = new UserRouter(new UserLayer(new FakeUserModel()));
            let request = mockReq({
                params: {
                    userID: 1
                }
            })
            let response = mockRes();

            await router.getUserByID(request, response);

            expect(response.status).to.have.been.calledWith(404);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("Failed to get user with id: 1")
            );
        });

        it('Should get user data', async () => {
            let twitchModel = new FakeUserModel();
            let userLayer = new UserLayer(twitchModel);
            let router = new UserRouter(userLayer);
            let request = mockReq({
                params: {
                    userID: 1
                }
            })
            let response = mockRes();
            twitchModel.addUser(1);

            await router.getUserByID(request, response);

            expect(response.status).to.have.been.calledWith(200);
            expect(response.json).to.have.been.calledWith(new DataMessage(await twitchModel.getByID(1)));
        });
    })
});