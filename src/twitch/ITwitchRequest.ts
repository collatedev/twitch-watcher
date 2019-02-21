import TwitchResponse from "./TwitchResponse";

export default interface ITwitchRequest {
	send() : Promise<TwitchResponse>;
}