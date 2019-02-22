import { use, expect } from 'chai';
import 'mocha';
import TestPartialValidator from "../mocks/TestPartialValidator";
import ComplexPartialBody from "./ComplexPartialBody";
import TestPartialBody from "./TestPartialBody";
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from '../../src/messages/ErrorMessage';
import StatusCodes from '../../src/routes/StatusCodes';

use(sinonChai);

describe('PartialBodyValidator', () => {
	describe('isValid', () => {
		it('Should fail because body is empty', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const body : TestPartialBody = new TestPartialBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body has incorrect properties', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const body : TestPartialBody = Object.assign({
				e: 1
			}) as TestPartialBody;

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because of undefined required values', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const body : TestPartialBody = new TestPartialBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because of null required values', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const body : TestPartialBody = new TestPartialBody({
				a: null
			});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should be valid because body is empty and there are no required fields', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>([]);
			const body : TestPartialBody = {} as TestPartialBody;
			
			expect(validator.isValid(body)).to.equal(true); 
		});

		it('Should return true because body is valid', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<ComplexPartialBody>(["a", "c"]);
			const body : ComplexPartialBody = new ComplexPartialBody({
				a: "",
				c: ""
			});

			expect(validator.isValid(body)).to.equal(true); 
		});
		
		it('Should return true because body is valid', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const body : TestPartialBody = new TestPartialBody({
				a: "asdf"
			});
			
			expect(validator.isValid(body)).to.equal(true); 
		});
	});

	describe('sendError', () => {
		it('Should send a body is empty error', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const response : any = mockRes();
			const body : TestPartialBody = {} as TestPartialBody;
			
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must not be empty")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should send a property missing message', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const response : any = mockRes();
			const body : TestPartialBody = Object.assign({
				e: 1
			}) as TestPartialBody;
			
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must contain a 'a' field")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should send a null property message', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const response : any = mockRes();
			const body : TestPartialBody = new TestPartialBody({
				a: null
			});

			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body has a null or undefined value on the 'a' field")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should send a undefined property message', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const response : any = mockRes();
			const body : TestPartialBody = new TestPartialBody({
				a: undefined
			});

			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body has a null or undefined value on the 'a' field")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should throw an error because the body is valid', () => {
			const validator : TestPartialValidator<TestPartialBody> = new TestPartialValidator<TestPartialBody>(["a"]);
			const response : any = mockRes();
			const body : TestPartialBody = new TestPartialBody({
				a: "",
			});
			
			expect(validator.sendError.bind(validator, response, body)).to.throw(
				"Should never reach this error message because the Body is valid."
			);
		});
	});	
});