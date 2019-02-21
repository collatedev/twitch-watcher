import { use, expect } from 'chai';
import 'mocha';
import BodyValidator from "../../src/validators/BodyValidator"
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';
import TestBody from './TestBody';

use(sinonChai);

describe('BodyValidator', () => {
	describe('isValid', () => {
		it('Should fail because body has undefined values', () => {
			const validator = new BodyValidator<TestBody>();
			
			const body = new TestBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body has null values', () => {
			const validator = new BodyValidator<TestBody>();
			
			const body = new TestBody({
				a: null,
				b: null,
				c: null
			});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body was casted', () => {
			const validator = new BodyValidator<TestBody>();
			
			const body = {} as TestBody
			
			expect(validator.isValid(body)).to.equal(false); 
		});
		
		it('Should return true because body is valid', () => {
			const validator = new BodyValidator<TestBody>();
			
			const body : TestBody = new TestBody({
				a: "a",
				b: true,
				c: 1
			});
			
			expect(validator.isValid(body)).to.equal(true); 
		});
	});

	describe('sendError', () => {
		it('Should send a missing property error due to null value', () => {
			const validator = new BodyValidator<TestBody>();
			const response = mockRes();
			
			const body = new TestBody({});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body is missing property: 'a' it is either null or undefined")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a missing property error due to undefined value', () => {
			const validator = new BodyValidator<TestBody>();
			const response = mockRes();

			const body = new TestBody({
				a: null,
				b: null,
				c: null
			});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body is missing property: 'a' it is either null or undefined")
			); 
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a casting error message', () => {
			const validator = new BodyValidator<TestBody>();
			const response = mockRes();

			const body = {} as TestBody
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Can not handle casted Bodys. Check your route for Body casting")
			);
			expect(response.status).to.have.been.calledWith(500);
		});
	});
})