import IValidatable from "./IValidatable";
import ObjectValidator from "./OjectValidator";

export default class QueryValidator<T extends IValidatable> extends ObjectValidator<T> {
	constructor() {
		super('Query');
	}
}