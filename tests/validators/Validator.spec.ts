import { use, expect } from 'chai';
import 'mocha';
import Validator from "../../src/validators/Validator";
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai';
import ErrorMessage from '../../src/messages/ErrorMessage';
import TestBody from './TestBody';
import StatusCodes from '../../src/routes/StatusCodes';

use(sinonChai);

describe('Validator', () => {
	describe('isValid', () => {
		it('Should fail because body has undefined values', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const body : TestBody = new TestBody({});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body has null values', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const body : TestBody = new TestBody({
				a: null,
				b: null,
				c: null
			});

			expect(validator.isValid(body)).to.equal(false); 
		});

		it('Should fail because body was casted', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const body : TestBody = {} as TestBody;
			
			expect(validator.isValid(body)).to.equal(false); 
		});
		
		it('Should return true because body is valid', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
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
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const response : any = mockRes();
			const body : TestBody = new TestBody({});
			
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body is missing property: 'a' it is either null or undefined")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should send a missing property error due to undefined value', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const response : any = mockRes();
			const body : TestBody = new TestBody({
				a: null,
				b: null,
				c: null
			});

			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body is missing property: 'a' it is either null or undefined")
			); 
			expect(response.status).to.have.been.calledWith(StatusCodes.BadRequest);
		});

		it('Should send a casting error message', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const response : any = mockRes();
			const body : TestBody = {} as TestBody;
			
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Can not handle casted Bodys. Check your route for Body casting")
			);
			expect(response.status).to.have.been.calledWith(StatusCodes.InternalError);
		});

		it('Should throw an error because the body is valid', () => {
			const validator : Validator<TestBody> = new Validator<TestBody>("Body");
			const response : any = mockRes();

			const body : TestBody = new TestBody({
				a: "",
				b: true,
				c: 1
			});
			
			expect(validator.sendError.bind(validator, response, body)).to.throw(
				"Should never reach this error message because the Body is valid."
			);
		});
	});
});