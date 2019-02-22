import IValidatable from "../validators/IValidatable";

export default class Validatable implements IValidatable {
	public getProperties() : string[] {
		return Object.keys(this);
	}
}