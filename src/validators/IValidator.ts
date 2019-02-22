import IValidatable from "./IValidatable";

export default interface IValidator<T extends IValidatable> {
    isValid(body:T): boolean;
    sendError(response: Express.Response, body: T): void;
}