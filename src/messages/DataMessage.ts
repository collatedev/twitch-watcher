import { Message } from "@collate/router";

export default class DataMessage extends Message {
	constructor(data: object) {
		super(true, data);
	}
}