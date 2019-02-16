import { use, expect } from 'chai';
import 'mocha';
import BodyValidator from "../../src/validators/BodyValidator"
import Validatable from "../../src/validators/Validatable";
import { mockRes } from 'sinon-express-mock';
import * as sinonChai from 'sinon-chai'
import ErrorMessage from '../../src/messages/ErrorMessage';

use(sinonChai);

class TestBody extends Validatable {
	a: string;
	b: boolean;
	c: number
	
	constructor(body: any) {
		super();
		this.a = body.a;
		this.b = body.b;
		this.c = body.c;
	}
}

describe('BodyValidator', () => {
	describe('isValid', () => {
		it('Should fail because body has undefined values', () => {
			let validator = new BodyValidator<TestBody>();
			
			let body = new TestBody({});

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should fail because body has null values', () => {
			let validator = new BodyValidator<TestBody>();
			
			let body = new TestBody({
				a: null,
				b: null,
				c: null
			});

			expect(validator.isValid(body)).to.be.false; 
		});

		it('Should fail because body was casted', () => {
			let validator = new BodyValidator<TestBody>();
			
			let body = {} as TestBody
			
			expect(validator.isValid(body)).to.be.false; 
		});
		
		it('Should return true because body is valid', () => {
			let validator = new BodyValidator<TestBody>();
			
			let body : TestBody = new TestBody({
				a: "a",
				b: true,
				c: 1
			});
			
			expect(validator.isValid(body)).to.be.true; 
		});
	});

	describe('sendError', () => {
		it('Should send a missing property error due to null value', () => {
			let validator = new BodyValidator<TestBody>();
			let response = mockRes();
			
			let body = new TestBody({});
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Body is missing property: 'a' it is either null or undefined")
			);
			expect(response.status).to.have.been.calledWith(400);
		});

		it('Should send a missing property error due to undefined value', () => {
			let validator = new BodyValidator<TestBody>();
			let response = mockRes();

			let body = new TestBody({
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
			let validator = new BodyValidator<TestBody>();
			let response = mockRes();

			let body = {} as TestBody
			validator.sendError(response, body);

			expect(response.json).to.have.been.calledWith(
				new ErrorMessage("Can not handle casted Bodys. Check your route for Body casting")
			);
			expect(response.status).to.have.been.calledWith(500);
		});
	});
})