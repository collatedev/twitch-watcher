import PartialValidator from "./PartialValidator";
import IValidatable from "./IValidatable";

export default class PartialQueryValidator<T extends IValidatable> extends PartialValidator<T> {
	constructor(requiredFields: Array<string>) {
		super('Query', requiredFields)
	}
}