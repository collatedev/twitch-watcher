import IValidator from "./IValidator";
import ErrorMessage from "../messages/ErrorMessage";
import StatusCodes from "../routes/StatusCodes";
import { Response } from "express"

export default class BodyValidator<T> implements IValidator<T> {
    private properties: Array<string>;

    constructor(properties: Array<string>) {
        this.properties = properties;
    }

    public isValid(body: T) {
        if (this.properties.length != 0 && this.isBodyEmpty(body)) {
            return false;
        }

        let keys : Array<string> = this.getKeys(body);
        for (let i = 0; i < this.properties.length; i++) {
            if (keys.indexOf(this.properties[i].trim()) == -1) {
                return false;
            }
        }
        return true;
    }

    private isBodyEmpty(body: T) {
        return Object.keys(body).length == 0;
    }

    public sendError(response: Response, body: T) {
        response.json(this.getErrorMessage(body)).status(StatusCodes.BadRequest);
    }

    private getErrorMessage(body: T): ErrorMessage {
        if (this.isBodyEmpty(body)) {
            return new ErrorMessage("Body must not be empty")
        }

        let keys : Array<string> = this.getKeys(body);
        for (let i = 0; i < this.properties.length; i++) {
            if (keys.indexOf(this.properties[i].trim()) == -1) {
                return new ErrorMessage(`Body must contain a ${this.properties[i]} field`);
            }
        }
        return new ErrorMessage("Body is valid, this point should not be reached");
    }

    private getKeys(body: T) {
        let keys = Object.keys(body);
        return keys.map((key) => {
            return key.trim();
        });
    }
}