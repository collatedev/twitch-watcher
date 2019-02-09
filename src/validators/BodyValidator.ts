export default class BodyValidator {
    private properties: Array<string>;

    constructor(properties: Array<string>) {
        this.properties = properties;
    }

    public isValidRequestBody<T>(body: T) {
        if (this.isBodyEmpty<T>(body)) {
            return false;
        }
        for (let i = 0; i < this.properties.length; i++) {
            if (!body.hasOwnProperty(this.properties[i])) {
                return false;
            }
        }
        return true;
    }

    private isBodyEmpty<T>(body: T) {
        for (let entry in Object.entries(body)) {
            return false;
        };
        return true;
    }

    public getErrorMessage<T>(body: T) {
        if (this.isBodyEmpty<T>(body)) {
            return "Body must not be empty"
        }
        for (let i = 0; i < this.properties.length; i++) {
            if (!body.hasOwnProperty(this.properties[i])) {
                return `Body must contain a ${this.properties[i]} field`;
            }
        }
        return "Body is valid, this point should not be reached";
    }
}