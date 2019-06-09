import IValidator from "./IValidator";
import ErrorMessage from "../messages/ErrorMessage";
import StatusCodes from "../routes/StatusCodes";
import { Response } from "express";
import IValidatable from "./IValidatable";

export default class PartialValidator<T extends IValidatable> implements IValidator<T> {
    private requiredFields: string[];
	private name: string;

    constructor(name: string, requiredFields: string[]) {
		this.requiredFields = requiredFields;
		this.name = name;
    }

    public isValid(body: T) : boolean {
        if (this.requiredFields.length !== 0 && this.isBodyEmpty(body)) {
            return false;
        }

		const entries : Array<[string, any]> = Object.entries(body);
		let matches : number = 0;
		for (const entry of entries) {
			const key : string = entry[0].trim();
			const value : any = entry[1];
			if (this.requiredFields.includes(key)) {
				matches++;
				if (value === null || value === undefined) {
					return false;
				}
			}
		}
        return matches === this.requiredFields.length;
	}

    private isBodyEmpty(body: T) : boolean {
        return Object.keys(body).length === 0;
    }

    public sendError(response: Response, body: T) : void {
        try {
			response.json(this.getErrorMessage(body)).status(StatusCodes.BadRequest);
		} catch (error) {
			throw error;
		}
    }

    private getErrorMessage(body: T): ErrorMessage {
        if (this.isBodyEmpty(body) && this.requiredFields.length !== 0) {
            return new ErrorMessage(`${this.name} must not be empty`);
		}
		
		const entries : Array<[string, any]> = Object.entries(body);
		const matches: string[] = [];
		for (const entry of entries) {
			const key : string = entry[0].trim();
			const value : any = entry[1];
			if (this.requiredFields.includes(key)) {
				matches.push(key);
				if (value === null || value === undefined) {
					return new ErrorMessage(
						`${this.name} has a null or undefined value on the '${key}' field`
					);
				}
			}
		}

		if (matches.length !== this.requiredFields.length) {
			for (const field of this.requiredFields) {
				if (!matches.includes(field)) {
					return new ErrorMessage(`${this.name} must contain a '${field}' field`);
				}
			}
		}
		throw new Error(`Should never reach this error message because the ${this.name} is valid.`);
    }
}