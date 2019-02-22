// TODO: Add a getValidator method which takes an array of required fields

export default interface IValidatable {
	getProperties(): string[];
}
