import StreamRouter from '../../src/routes/StreamRouter';
import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from '../../src/messages/ErrorMessage';
import StatusCodes from '../../src/routes/StatusCodes';

use(sinonChai);

describe('Stream Router', () => {
	describe('setup', () => {
		const router : StreamRouter = new StreamRouter();

		try {
			router.setup();
		} catch (error) {
			throw error;
		}
	});

    describe('handleChallenge', () => {
		it('Should fail', async () => {
			const router : StreamRouter = new StreamRouter();
			const request : any = mockReq();
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.topic' it is either null or undefined")
			);
		});
    });

    describe('handleWebhookCall', () => {
		it('Should fail', async () => {
			const router : StreamRouter = new StreamRouter();
			const request : any = mockReq({
				body: {
					data: []
				}
			});
			const response : any = mockRes();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}
		});
    });
});