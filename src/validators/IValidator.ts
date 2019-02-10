export default interface IValidator<T> {
    isValid(body:T): boolean;
    sendError(response: Express.Response, body: T): void
}