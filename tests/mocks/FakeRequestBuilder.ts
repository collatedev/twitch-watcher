import IRequestBuilder from "../../src/request_builder/IRequestBuilder";
import { RequestInit, Response } from "node-fetch";

export default class FakeRequestBuilder implements IRequestBuilder {
	private responses: Response[];

	constructor() {
		this.responses = [];
	}

	public queueResponse(response: Response) {
		this.responses.push(response);
	}

	public async makeRequest(url: string, options: RequestInit): Promise<Response> {
		return new Promise((resolve, reject) => {
			if (this.responses.length === 0) {
				return reject(new Error('Request Failed'));
			} else {
				return resolve(this.responses.shift());
			}
		}) 
	}
}