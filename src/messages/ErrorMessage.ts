import Message from "./Message";

export default class ErrorMessage extends Message {
	constructor(message : string) {
		super(message, false);
	}
}