export default class Message {
	private message: string;
	private success: boolean;
	private dateSent: Date;
	
	constructor(message: string, success: boolean) {
		this.message = message;
		this.success = success;
		this.dateSent = new Date();
	}
}