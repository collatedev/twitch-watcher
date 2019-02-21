import IValidatable from "../validators/IValidatable";

export default class Validatable implements IValidatable {
	public getProperties() {
		return Object.keys(this);
	}
}