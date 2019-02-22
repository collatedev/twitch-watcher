import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from "../../src/messages/ErrorMessage";
import TestTopicRouter from "../mocks/TestTopicRouter";
import DataMessage from '../../src/messages/DataMessage';
import StatusCodes from '../../src/routes/StatusCodes';
import TestBody from "../mocks/TestBody";

use(sinonChai);

describe('Topic Router', () => {
	describe('setup', () => {
		const router : TestTopicRouter = new TestTopicRouter();
		
		try {
			router.setup();
		} catch(error) {
			throw error;
		}
	});

	describe('handleChallenge', () => {
		it('Should fail because there the query is empty', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
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

		it('Should fail because hub.mode is missing', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				query: {
					"hub.topic": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Challenge Query is missing property: 'hub.mode' it is either null or undefined")
			);
		});

		it('Should fail because hub.topic is missing', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				query: {
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
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

		it('Should fail because hub.lease_seconds is missing', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.challenge": "challenge token"
				}
			});
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Challenge Query is missing property: 'hub.lease_seconds' it is either null or undefined")
			);
		});

		it('Should fail because hub.challenge is missing', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123
				}
			});
			const response : any = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Challenge Query is missing property: 'hub.challenge' it is either null or undefined")
			);
		});

		it('Should call send with challenge token', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
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
		it('Should fail because body is not valid', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq();
			const response : any = mockRes();
			router.failNextRequest();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Test Body has a null or undefined value on the 'a' field")
			);
		});

		it('Should fail to process data', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				body: {
					a: true
				}
			});
			const response : any = mockRes();
			router.failNextRequest();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.InternalError);
			expect(response.json).to.have.been.calledWith();
		});

		it('Should process data', async () => {
			const router : TestTopicRouter = new TestTopicRouter();
			const request : any = mockReq({
				body: {
					a: true
				}
			});
			const response : any = mockRes();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(StatusCodes.OK);
			expect(response.json).to.have.been.calledWith(
				new DataMessage({
					desc: `Recieved data under topic: /test`,
					body: new TestBody({ a: true }),
					processedData: true
				})
			);
		});
	});
});