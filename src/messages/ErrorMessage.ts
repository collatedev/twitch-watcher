import { Message } from "@collate/router";

export default class ErrorMessage extends Message {
	public readonly error : any;

	constructor(error : any) {
		super(false, null);
		this.error = error;
	}
}