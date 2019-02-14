export default class Message {
	private message: string;
	private success: boolean;
	
	constructor(message: string, success: boolean) {
		this.message = message;
		this.success = success;
	}
}