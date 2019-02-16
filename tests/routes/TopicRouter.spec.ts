import { use, expect } from 'chai';
import 'mocha';
import { mockReq, mockRes } from 'sinon-express-mock'
import * as sinonChai from 'sinon-chai'
import ErrorMessage from "../../src/messages/ErrorMessage";
import TestTopicRouter from "../mocks/TestTopicRouter";
import DataMessage from '../../src/messages/DataMessage';

use(sinonChai);

describe('Topic Router', () => {
	describe('handleChallenge', () => {
		it('Should fail because there the query is empty', async () => {
			let router = new TestTopicRouter();
			let request = mockReq();
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.topic' it is either null or undefined")
			);
		});

		it('Should fail because hub.mode is missing', async () => {
			let router = new TestTopicRouter();
			let request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.mode' it is either null or undefined")
			);
		});

		it('Should fail because hub.topic is missing', async () => {
			let router = new TestTopicRouter();
			let request = mockReq({
				query: {
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge token"
				}
			});
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.topic' it is either null or undefined")
			);
		});

		it('Should fail because hub.lease_seconds is missing', async () => {
			let router = new TestTopicRouter();
			let request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.challenge": "challenge token"
				}
			});
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.lease_seconds' it is either null or undefined")
			);
		});

		it('Should fail because hub.challenge is missing', async () => {
			let router = new TestTopicRouter();
			let request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123
				}
			});
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(400);
			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Query is missing property: 'hub.challenge' it is either null or undefined")
			);
		});

		it('Should call send with challenge token', async () => {
			let router = new TestTopicRouter();
			let request = mockReq({
				query: {
					"hub.topic": "value",
					"hub.mode": "value",
					"hub.lease_seconds": 123,
					"hub.challenge": "challenge_token"
				}
			});
			let response = mockRes();

			await router.handleChallenge(request, response);

			expect(response.status).to.have.been.calledWith(200);
			expect(response.send).to.have.been.calledWith("challenge_token");
		});
	});

	describe('handleWebhookCall', () => {
		it('Should fail to process data', async () => {
			let router = new TestTopicRouter();
			let request = mockReq();
			let response = mockRes();
			router.failNextRequest();

			await router.handleWebhookCall(request, response);

			expect(response.status).to.have.been.calledWith(500);
			expect(response.json).to.have.been.calledWith(
				new DataMessage({
					desc: `Recieved data under topic: /test`,
					body: {},
					processedData: false
				})
			);
		});

		it('Should process data', async () => {
			let router = new TestTopicRouter();
			let request = mockReq();
			let response = mockRes();

			await router.handleWebhookCall(request, response);

			expect(response.status).to.have.been.calledWith(200);
			expect(response.json).to.have.been.calledWith(
				new DataMessage({
					desc: `Recieved data under topic: /test`,
					body: {},
					processedData: true
				})
			);
		})
	})
});