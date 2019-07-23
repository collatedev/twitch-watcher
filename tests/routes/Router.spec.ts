import Router from "../../src/routes/Router";
import TestRouter from "../fakes/TestRouter";


describe('getPath', () => {
	test('Should get path of the router', () => {
		const router : Router = new TestRouter();

		expect(router.getPath()).toEqual("/api/v1/test");
	});
});

describe('getRouter', () => {
	test('Should get router object', () => {
		const router : Router = new TestRouter();
		
		expect(router.getRouter()).not.toBeNull();
	});
});