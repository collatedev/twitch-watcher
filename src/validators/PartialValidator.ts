import IValidator from "./IValidator";
import ErrorMessage from "../messages/ErrorMessage";
import StatusCodes from "../routes/StatusCodes";
import { Response } from "express"
import IValidatable from "./IValidatable";

export default abstract class PartialValidator<T extends IValidatable> implements IValidator<T> {
    private requiredFields: Array<string>;
	private name: string;

    constructor(name: string, requiredFields: Array<string>) {
		this.requiredFields = requiredFields;
		this.name = name;
    }

    public isValid(body: T) {
        if (this.requiredFields.length != 0 && this.isBodyEmpty(body)) {
            return false;
        }

		let keys : Array<string> = this.getKeys(body);
		let values : Array<string> = Object.values(body);
        for (let i = 0; i < this.requiredFields.length; i++) {
            if (keys.indexOf(this.requiredFields[i].trim()) == -1) {
                return false;
			}
			if (values[i] === null || values[i] === undefined) {
				return false;
			}
        }
        return true;
	}
	
	private getKeys(body: T) {
        let keys = Object.keys(body);
        return keys.map((key) => {
            return key.trim();
        });
    }

    private isBodyEmpty(body: T) {
        return Object.keys(body).length == 0;
    }

    public sendError(response: Response, body: T) {
        response.json(this.getErrorMessage(body)).status(StatusCodes.BadRequest);
    }

    private getErrorMessage(body: T): ErrorMessage {
        if (this.isBodyEmpty(body) && this.requiredFields.length != 0) {
            return new ErrorMessage(`${this.name} must not be empty`)
        }

		let keys : Array<string> = this.getKeys(body);
		let values : Array<string> = Object.values(body);
        for (let i = 0; i < this.requiredFields.length; i++) {
            if (keys.indexOf(this.requiredFields[i].trim()) == -1) {
                return new ErrorMessage(`${this.name} must contain a '${this.requiredFields[i]}' field`);
			}
			if (values[i] === null || values[i] === undefined) {
				return new ErrorMessage(
					`${this.name} has a null or undefined value on the '${this.requiredFields[i]}' field`
				);
			}
        }
        return new ErrorMessage("Body is valid, this point should not be reached");
    }
}