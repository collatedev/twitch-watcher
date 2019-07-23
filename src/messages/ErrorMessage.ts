import Message from "./Message";

export default class ErrorMessage extends Message {
	public readonly errors : any;

	constructor(errors : any) {
		super(false);
		this.errors = errors;
	}
}