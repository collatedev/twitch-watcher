import { use, expect } from 'chai';
import 'mocha';
import TestPartialValidator from "../mocks/TestPartialValidator"
import ComplexPartialBody from "./ComplexPartialBody";
import TestPartialBody from "./TestPartialBody";
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';

use(sinonChai);

describe('PartialBodyValidator', () => {
	describe('isValid', () => {
		it('Should fail because body is empty', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			
			const body = new TestPartialBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body has incorrect properties', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			
			const body = Object.assign({
				e: 1
			}) as TestPartialBody;

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because of undefined required values', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			
			const body = new TestPartialBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because of null required values', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			
			const body = new TestPartialBody({
				a: null
			});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should be valid because body is empty and there are no required fields', () => {
			const validator = new TestPartialValidator<TestPartialBody>([]);
			
			const body = {} as TestPartialBody
			
			expect(validator.isValid(body)).to.equal(true); 
		});

		it('Should return true because body is valid', () => {
			const validator = new TestPartialValidator<ComplexPartialBody>(["a", "c"]);
			
			const body = new ComplexPartialBody({
				a: "",
				c: ""
			});

			expect(validator.isValid(body)).to.equal(true); 
		});
		
		it('Should return true because body is valid', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			
			const body : TestPartialBody = new TestPartialBody({
				a: "asdf"
			});
			
			expect(validator.isValid(body)).to.equal(true); 
		});
	});

	describe('sendError', () => {
		it('Should send a body is empty error', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			const response = mockRes();
			
			const body = {} as TestPartialBody
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must not be empty")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a property missing message', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			const response = mockRes();

			const body = Object.assign({
				e: 1
			}) as TestPartialBody;
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body must contain a 'a' field")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a null property message', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			const response = mockRes();

			const body = new TestPartialBody({
				a: null
			});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body has a null or undefined value on the 'a' field")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a undefined property message', () => {
			const validator = new TestPartialValidator<TestPartialBody>(["a"]);
			const response = mockRes();

			const body = new TestPartialBody({
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