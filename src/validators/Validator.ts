import IValidator from "./IValidator";
import { Response } from "express";
import StatusCodes from "../routes/StatusCodes";
import ErrorMessage from "../messages/ErrorMessage";
import IValidatable from "./IValidatable";

export default class Validator<T extends IValidatable> implements IValidator<T> {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	public isValid(body: T): boolean {
		if (this.wasObjectCasted(body)) {
			return false;
		}
		
		const values : any[] = Object.values(body);
		for (const value of values) {
			if (value === null || value === undefined) {
				return false;
			}
		}
		return true;
	}

	private wasObjectCasted(body: T) : boolean {
		try {
			// this will fail if an object was casted to this 
			// type because properties method will be undefined
			body.getProperties();
			return false;
		} catch (error) {
			return true;
		}
	}
	
	public sendError(response: Response, body: T): void {
		if (this.wasObjectCasted(body)) {
			const error : ErrorMessage = new ErrorMessage(
				`Can not handle casted ${this.name}s. Check your route for ${this.name} casting`
			);
			response.json(error).status(StatusCodes.InternalError);
		} else {
			response.json(this.getErrorMessage(body)).status(StatusCodes.BadRequest);
		}
	}

	private getErrorMessage(body: T): ErrorMessage {
		const values : any[] = Object.values(body);
		const keys : string[] = Object.keys(body);
		for (let i : number = 0; i < values.length; i++) {
			if (values[i] === null || values[i] === undefined) {
				return new ErrorMessage(`${this.name} is missing property: '${keys[i]}' it is either null or undefined`);
			}
		}
		throw new Error(`Should never reach this error message because the ${this.name} is valid.`);
    }
}