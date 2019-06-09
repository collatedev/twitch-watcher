import PartialValidator from "../../src/validators/PartialValidator";
import IValidatable from "../../src/validators/IValidatable";

export default class TestPartialValidator<T extends IValidatable> extends PartialValidator<T> {
	constructor(requiredFields: string[]) {
		super('Body', requiredFields);
	}
}