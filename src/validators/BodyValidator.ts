import ObjectValidator from "./ObjectValidator";
import IValidatable from "./IValidatable";

export default class BodyValidator<T extends IValidatable> extends ObjectValidator<T> {
	constructor() {
		super('Body');
	}
}