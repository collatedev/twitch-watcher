import IValidatable from "../validators/IValidatable";

export default class Validatable implements IValidatable {
	getProperties() {
		return Object.keys(this);
	}
}