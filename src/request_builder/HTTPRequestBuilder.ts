import fetch, { RequestInit, Response } from "node-fetch";
import IRequestBuilder from "./IRequestBuilder";

export default class HTTPRequestBuilder implements IRequestBuilder {
	public makeRequest(url: string, init: RequestInit): Promise<Response> {
		return fetch(url, init);
	}
}