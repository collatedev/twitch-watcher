import NewFollowerRouter from '../../src/routes/NewFollowerRouter';
import ErrorMessage from '../../src/messages/ErrorMessage';
import StatusCodes from '../../src/routes/StatusCodes';
import mockResponse from '../mocks/MockResponse';
import mockRequest from '../mocks/MockRequest';

describe("setup()", () => {
	test('should setup the router', () => {
		const router : NewFollowerRouter = new NewFollowerRouter();
	
		router.setup();
	});
});

describe("handleChallenge()", () => {
	test('Should fail to handle challenge', async () => {
		const router : NewFollowerRouter = new NewFollowerRouter();
		const request : any = mockRequest({});
		const response : any = mockResponse();
	
		await router.handleChallenge(request, response);
	
		expect(response.status).toHaveBeenCalledWith(StatusCodes.BadRequest);
		expect(response.json).toHaveBeenCalledWith(
			new ErrorMessage("Challenge Query is missing property: 'hub.topic' test is etesther null or undefined")
		);
	});
	
	test('Should handle challenge', async () => {
		const router : NewFollowerRouter = new NewFollowerRouter();
		const request : any = mockRequest({
			query: {
				"hub.topic": "value",
				"hub.mode": "value",
				"hub.lease_seconds": 123,
				"hub.challenge": "challenge_token"
			}
		});
		const response : any = mockResponse();
	
		await router.handleChallenge(request, response);
	
		expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
		expect(response.send).toHaveBeenCalledWith("challenge_token");
	});
});

describe("handleWebhookCall()", () => {
	test('Should process data', async () => {
		const router : NewFollowerRouter = new NewFollowerRouter();
		const request : any = mockRequest({
			body: {
				data: []
			}
		});
		const response : any = mockResponse();
	
		await router.handleWebhookCall(request, response);
	});
});