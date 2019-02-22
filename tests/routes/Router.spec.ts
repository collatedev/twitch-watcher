import { expect } from "chai";
import "mocha";
import Router from "../../src/routes/Router";
import TestRouter from "../mocks/TestRouter";

describe('Router', () => {
	describe('getPath', () => {
		it ('Should get path of the router', () => {
			const router : Router = new TestRouter();

			expect(router.getPath()).to.equal("/api/v1/test");
		});
	});

	describe('getRouter', () => {
		it ('Should get router object', () => {
			const router : Router = new TestRouter();
			
			expect(router.getRouter()).to.not.be.equal(null);
		});
	});
});