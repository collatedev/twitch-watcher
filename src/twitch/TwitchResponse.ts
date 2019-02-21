import ITwitchResponse from "./ITwitchResponse";
import { Response, RequestInit } from "node-fetch";

export default class TwitchResponse implements ITwitchResponse {
	public readonly HTTPResponse: Response;	
	public readonly request: RequestInit;

	constructor(request: RequestInit, HTTPResponse: Response) {
		this.request = request;
		this.HTTPResponse = HTTPResponse;
	}
}