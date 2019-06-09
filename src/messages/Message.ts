export default class Message {
	public readonly message : string;
	public readonly success : boolean;
	
	constructor(message: string, success: boolean) {
		this.message = message;
		this.success = success;
	}
}