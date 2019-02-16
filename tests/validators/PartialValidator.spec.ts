import { use, expect } from 'chai';
import 'mocha';
import TestPartialValidator from "../mocks/TestPartialValidator"
import Validatable from "../../src/validators/Validatable";
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';

use(sinonChai);

class TestBody extends Validatable {
	a: string;
	
	constructor(body: any) {
		super();
		this.a = body.a;
	}
}

describe('PartialBodyValidator', () => {
	describe('isValid', () => {
		it('Should fail because body is empty', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			
			let body = new TestBody({});

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should fail because body has incorrect properties', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			
			let body = Object.assign({
				e: 1
			}) as TestBody;

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should fail because of undefined required values', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			
			let body = new TestBody({});

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should fail because of null required values', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			
			let body = new TestBody({
				a: null
			});

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should be valid because body is empty and there are no required fields', () => {
			let validator = new TestPartialValidator<TestBody>([]);
			
			let body = {} as TestBody
			
			expect(validator.isValid(body)).to.be.true; 
		});
		
		it('Should return true because body is valid', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			
			let body : TestBody = new TestBody({
				a: "asdf"
			});
			
			expect(validator.isValid(body)).to.be.true; 
		});
	});

	describe('sendError', () => {
		it('Should send a body is empty error', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			let response = mockRes();
			
			let body = {} as TestBody
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must not be empty")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a property missing message', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			let response = mockRes();

			let body = Object.assign({
				e: 1
			}) as TestBody;
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must contain a 'a' field")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a null property message', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			let response = mockRes();

			let body = new TestBody({
				a: null
			});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body has a null or undefined value on the 'a' field")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a undefined property message', () => {
			let validator = new TestPartialValidator<TestBody>(["a"]);
			let response = mockRes();

			let body = new TestBody({
				a: undefined
			});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body has a null or undefined value on the 'a' field")
			);
			expect(response.status).to.have.been.calledWith(400);
		});
	})	
})