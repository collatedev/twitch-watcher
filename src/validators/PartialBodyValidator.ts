import PartialValidator from "./PartialValidator";
import IValidatable from "./IValidatable";

export default class PartialBodyValidator<T extends IValidatable> extends PartialValidator<T> {
	constructor(requiredFields: string[]) {
		super('Body', requiredFields);
	}
}