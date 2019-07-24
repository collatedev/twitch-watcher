import NewFollowerRouter from '../../src/routes/NewFollowerRouter';
import ErrorMessage from '../../src/messages/ErrorMessage';
import StatusCodes from '../../src/routes/StatusCodes';
import mockResponse from '../mocks/MockResponse';
import mockRequest from '../mocks/MockRequest';
import IRouteHandler from '../../src/routes/IRouteHandler';
import FakeLogger from "../fakes/FakeLogger";
import { ILogger } from "@collate/logging";
import ChallengeQueryRequestSchema from '../../src/api/WebhookChallengeRequest.json';
import { ValidationSchema, IValidationSchema } from '@collate/request-validator';

const ChallengeSchema : IValidationSchema = new ValidationSchema(ChallengeQueryRequestSchema);

const logger : ILogger = new FakeLogger();

const Router : NewFollowerRouter = new NewFollowerRouter(logger);
Router.setup();

describe("validate() [middleware]", () => {
	test('Should fail to handle challenge', (done : any) => {
		const request : any = mockRequest({
			query: {
				"hub.lease_seconds": 500,
				"hub.mode": "subscribe",
				"hub.challenge": "bar"
			}
		});
		const response : any = mockResponse();
	
		const middleWare : IRouteHandler = Router.validate(ChallengeSchema);
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
});

describe("handleChallenge()", () => {
	
	test('Should handle challenge', async () => {
		const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
			}
		});
		const response : any = mockResponse();

		await Router.handleChallenge(request, response);
	
		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.send).toHaveBeenCalledWith("challenge_token");
	});
});

describe("handleWebhookCall()", () => {
	test('Should process data', async () => {
		const request : any = mockRequest({
			body: {
				data: []
			}
		});
		const response : any = mockResponse();
	
		await Router.handleWebhookCall(request, response);
	});
});