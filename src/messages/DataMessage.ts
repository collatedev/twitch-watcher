import Message from "./Message"

export default class DataMessage extends Message {
	private data: Object;

	constructor(data: object) {
		super("Success", true);
		this.data = data;
	}
}