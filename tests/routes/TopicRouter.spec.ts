import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from "../../src/messages/ErrorMessage";
import TestTopicRouter from "../mocks/TestTopicRouter";
import DataMessage from '../../src/messages/DataMessage';

use(sinonChai);

describe('Topic Router', () => {
	describe('setup', () => {
		const router = new TestTopicRouter();
		
		try {
			router.setup();
		} catch(error) {
			throw error;
		}
	})

	describe('handleChallenge', () => {
		it('Should fail because there the query is empty', async () => {
			const router = new TestTopicRouter();
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

		it('Should fail because hub.mode is missing', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
			const response = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.mode' it is either null or undefined")
			);
		});

		it('Should fail because hub.topic is missing', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				query: {
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
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

		it('Should fail because hub.lease_seconds is missing', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.challenge": "challenge token"
				}
			});
			const response = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.lease_seconds' it is either null or undefined")
			);
		});

		it('Should fail because hub.challenge is missing', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123
				}
			});
			const response = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.challenge' it is either null or undefined")
			);
		});

		it('Should call send with challenge token', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge_token"
				}
			});
			const response = mockRes();

			try {
				await router.handleChallenge(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(200);
			expect(response.send).to.have.been.calledWith("challenge_token");
		});
	});

	describe('handleWebhookCall', () => {
		it('Should fail because body is not valid', async () => {
			const router = new TestTopicRouter();
			const request = mockReq();
			const response = mockRes();
			router.failNextRequest();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must not be empty")
			);
		});

		it('Should fail to process data', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				body: {
					a: true
				}
			});
			const response = mockRes();
			router.failNextRequest();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(500);
			expect(response.json).to.have.been.calledWith(
				new DataMessage({
					desc: `Recieved data under topic: /test`,
					body: { a: true },
					processedData: false
				})
			);
		});

		it('Should process data', async () => {
			const router = new TestTopicRouter();
			const request = mockReq({
				body: {
					a: true
				}
			});
			const response = mockRes();

			try {
				await router.handleWebhookCall(request, response);
			} catch(error) {
				throw error;
			}

			expect(response.status).to.have.been.calledWith(200);
			expect(response.json).to.have.been.calledWith(
				new DataMessage({
					desc: `Recieved data under topic: /test`,
					body: { a: true },
					processedData: true
				})
			);
		})
	})
});