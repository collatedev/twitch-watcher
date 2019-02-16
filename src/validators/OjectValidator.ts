import IValidator from "./IValidator";
import { Response } from "express";
import StatusCodes from "../routes/StatusCodes";
import ErrorMessage from "../messages/ErrorMessage";
import IValidatable from "./IValidatable";

export default abstract class ObjectValidator<T extends IValidatable> implements IValidator<T> {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	public isValid(body: T): boolean {
		if (this.wasObjectCasted(body)) {
			return false;
		}
		
		let values = Object.values(body);
		for (let i = 0; i < values.length; i++) {
			if (values[i] === null || values[i] === undefined) {
				return false;
			}
		}
		return true;
	}

	private wasObjectCasted(body: T) {
		try {
			// this will fail if an object was casted to this type with out the method
			let properties = body.getProperties(); 
			let keys = this.getKeys(body);

			if (properties.length != keys.length) {
				return false;
			}

			for (let i = 0; i < properties.length; i++) {
				if (keys.indexOf(properties[i]) == -1) {
					return true;
				}
			}
			return false;
		} catch (error) {
			return true;
		}
	}

	private getKeys(body: T) {
        let keys = Object.keys(body);
        return keys.map((key) => {
            return key.trim();
        });
    }
	
	public sendError(response: Response, body: T): void {
		if (this.wasObjectCasted(body)) {
			let error = new ErrorMessage(
				`Can not handle casted ${this.name}s. Check your route for ${this.name} casting`
			);
			response.json(error).status(StatusCodes.InternalError);
		} else {
			response.json(this.getErrorMessage(body)).status(StatusCodes.BadRequest);
		}
	}

	private getErrorMessage(body: T): ErrorMessage {
		let values = Object.values(body);
		let keys = Object.keys(body);
		for (let i = 0; i < values.length; i++) {
			if (values[i] === null || values[i] === undefined) {
				return new ErrorMessage(`${this.name} is missing property: '${keys[i]}' it is either null or undefined`);
			}
		}
		return new ErrorMessage(`Should never reach this error message because the ${this.name} is valid.`);
    }
}