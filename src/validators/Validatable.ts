import IValidatable from "../validators/IValidatable";

export default abstract class Validatable implements IValidatable {
	public getProperties() : string[] {
		return Object.keys(this);
	}
}