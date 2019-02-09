import HookRouter from "../../src/routes/HookRouter"
import { use, expect } from 'chai';
import 'mocha';
import FakeTwitchUserModel from "../mocks/FakeTwitchUserModel";
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import { Response } from "express"
import ErrorMessage from "../../src/schemas/ErrorMessage";

use(sinonChai);

describe('Hook Router', () => {
    describe('getUserRoute', () => {
        it('Should fail due to a string userID', async () => {
            let router = new HookRouter(new FakeTwitchUserModel());
            let request = mockReq({
                params: {
                    userID: "String"
                }
            })
            let response = mockRes();

            await router.getUserRoute(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be an integer value, instead received 'NaN'")
            );
        });

        it('Should fail due to a float userID', async () => {
            let router = new HookRouter(new FakeTwitchUserModel());
            let request = mockReq({
                params: {
                    userID: "1.1"
                }
            })
            let response = mockRes();

            await router.getUserRoute(request, response);

            expect(response.status).to.have.been.calledWith(400);
            expect(response.json).to.have.been.calledWith(
                new ErrorMessage("The Twitch User ID must be an integer value, instead received '1.1'")
            );
        })

        it('Should get user data', () => {
            let router = new HookRouter(new FakeTwitchUserModel());
        })
    })
});