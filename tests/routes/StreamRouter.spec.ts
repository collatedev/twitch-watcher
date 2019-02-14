import StreamRouter from '../../src/routes/StreamRouter';
import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';

use(sinonChai);

describe('Stream Router', () => {
    describe('handleChallenge', async () => {
		let router = new StreamRouter();
		let request = mockReq();
		let response = mockRes();

		try {
			await router.handleChallenge(request, response);
		} catch (error) {
			console.log(error);
		}

		expect(response.status).to.have.been.calledWith(400);
		expect(response.json).to.have.been.calledWith(
			new ErrorMessage("Body must not be empty")
		);
    });

    describe('handleWebhookCall', () => {

    })
});