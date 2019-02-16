import ObjectValidator from "./OjectValidator";
import IValidatable from "./IValidatable";

export default class BodyValidator<T extends IValidatable> extends ObjectValidator<T> {
	constructor() {
		super('Body');
	}
}