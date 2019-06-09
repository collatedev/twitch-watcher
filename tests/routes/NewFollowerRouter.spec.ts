import NewFollowerRouter from '../../src/routes/NewFollowerRouter';
import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from '../../src/messages/ErrorMessage';
import StatusCodes from '../../src/routes/StatusCodes';

use(sinonChai);

describe('New Followed Router', () => {
	describe('setup', () => {
		it('should setup the router', () => {
            const router : NewFollowerRouter = new NewFollowerRouter();
            try {
                router.setup();
            } catch (error) {
                throw error;
            }
        });
	});

    describe('handleChallenge', () => {
		it('Should fail', async () => {
			const router : NewFollowerRouter = new NewFollowerRouter();
			const request : any = mockReq();
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Challenge Query is missing property: 'hub.topic' it is either null or undefined")
			);
		});

		it('Should handle challenge', async () => {
			const router : NewFollowerRouter = new NewFollowerRouter();
			const request : any = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge_token"
				}
			});
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.OK);
			expect(response.send).to.have.been.calledWith("challenge_token");
		});
    });

    describe('handleWebhookCall', () => {
		it('Should process data', async () => {
			const router : NewFollowerRouter = new NewFollowerRouter();
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