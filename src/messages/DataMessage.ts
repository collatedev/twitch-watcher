import Message from "./Message";

export default class DataMessage extends Message {
	public readonly data : object;

	constructor(data: object) {
		super(true);
		this.data = data;
	}
}