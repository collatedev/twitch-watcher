import Message from "./Message"

export default class DataMessage extends Message {
	private data: object;

	constructor(data: object) {
		super("Success", true);
		this.data = data;
	}
}