import fetch, { RequestInit, Response } from "node-fetch";

export default class HTTPRequestBuilder {
	public makeRequest(url: string, init: RequestInit): Promise<Response> {
		return fetch(url, init);
	}
}