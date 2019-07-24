import ErrorMessage from "../../src/messages/ErrorMessage";
import TestTopicRouter from "../fakes/TestTopicRouter";
import DataMessage from '../../src/messages/DataMessage';
import StatusCodes from '../../src/routes/StatusCodes';
import TestBody from "../fakes/TestBody";
import mockResponse from '../mocks/MockResponse';
import mockRequest from '../mocks/MockRequest';
import IRouteHandler from "../../src/routes/IRouteHandler";
import ChallengeQueryRequestSchema from '../../src/api/WebhookChallengeRequest.json';
import TopicTestRequestSchema from '../api/TestTopic.json';
import { ValidationSchema, IValidationSchema } from "@collate/request-validator";

const ChallengeSchema : IValidationSchema = new ValidationSchema(ChallengeQueryRequestSchema);
const TopicTestSchema : IValidationSchema = new ValidationSchema(TopicTestRequestSchema);

describe("validate() [middleware]", () => {
	test(`Should fail because the body is empty`, async (done : any) => {
        const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
        router.setup();
        const request : any = mockRequest({});
        const response : any = mockResponse();
	
		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "",
						message: "Missing property 'query'",
					}
				])
			);
			done();
		});
	});

	test('Should fail because hub.mode is missing', async (done : any) => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "http://test.com",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge token"
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "query",
						message: "Missing property 'hub.mode'",
					}
				])
			);
			done();
		});
	});

	test('Should fail because hub.topic is missing', async (done : any) => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.mode": "subscribe",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge token"
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "query",
						message: "Missing property 'hub.topic'",
					}
				])
			);
			done();
		});
	});

	test('Should fail because hub.lease_seconds is missing', async (done : any) => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "http://test.com",
				"hub.mode": "subscribe",
				"hub.challenge": "challenge token"
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "query",
						message: "Missing property 'hub.lease_seconds'",
					}
				])
			);
			done();
		});
	});

	test('Should fail because hub.challenge is missing', async (done : any) => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "http://test.com",
				"hub.mode": "subscribe",
				"hub.lease_seconds": 123
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(ChallengeSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "query",
						message: "Missing property 'hub.challenge'",
					}
				])
			);
			done();
		});
	});

	test('Should fail because body is not valid', async (done : any) => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				a: {
					
				}
			}
		});
		const response : any = mockResponse();

		const middleWare : IRouteHandler = router.validate(TopicTestSchema);
		middleWare(request, response, () => {
			expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
			expect(response.json).toHaveBeenCalledWith(
				new ErrorMessage([
					{
						location: "query.a",
						message: "Property 'a' should be type 'boolean'",
					}
				])
			);
			done();
		});
	});
});

describe('handleChallenge', () => {
	test('Should call send with challenge token', async () => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
			}
		});
		const response : any = mockResponse();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.json).toHaveBeenCalledWith(new DataMessage({
			desc: `Recieved data under topic: /test`,
			body: undefined,
			processedData: true
		}));
	});
});

describe('handleWebhookCall', () => {
	test('Should fail to process data', async () => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			body: {
				a: true
			}
		});
		const response : any = mockResponse();
		router.failNextRequest();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.InternalError);
		expect(response.json).toHaveBeenCalledWith(new ErrorMessage("Failed to process webhook data"));
	});

	test('Should process data', async () => {
		const router : TestTopicRouter = new TestTopicRouter(TopicTestSchema);
		router.setup();
		const request : any = mockRequest({
			body: {
				a: true
			}
		});
		const response : any = mockResponse();

		await router.handleWebhookCall(request, response);

		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.json).toHaveBeenCalledWith(
			new DataMessage({
				desc: `Recieved data under topic: /test`,
				body: new TestBody({ a: true }),
				processedData: true
			})
		);
	});
});