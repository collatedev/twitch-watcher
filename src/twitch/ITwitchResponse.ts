import { Response, RequestInit } from "node-fetch";

export default interface ITwitchResponse {
	HTTPResponse: Response;
	request: RequestInit;
}