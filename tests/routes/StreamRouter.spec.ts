import StreamRouter from '../../src/routes/StreamRouter';
import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';

use(sinonChai);

describe('Stream Router', () => {
	describe('setup', () => {
		const router = new StreamRouter();

		try {
			router.setup();
		} catch (error) {
			throw error;
		}
	})

    describe('handleChallenge', () => {
		it('Should fail', async () => {
			const router = new StreamRouter();
			const request = mockReq();
			const response = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.topic' it is either null or undefined")
			);
		});
    });

    describe('handleWebhookCall', () => {
		it('Should fail', async () => {
			const router = new StreamRouter();
			const request = mockReq({
				body: {
					data: []
				}
			});
			const response = mockRes();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}
		});
    })
});