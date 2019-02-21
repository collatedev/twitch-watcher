import IChallengeQuery from "./IChallengeQuery";
import Validatable from "../../validators/Validatable";

export default class ChallengeQuery extends Validatable implements IChallengeQuery {
	public readonly 'hub.topic': string;	
	public readonly 'hub.lease_seconds': number;
	public readonly 'hub.mode': string;
	public readonly 'hub.challenge': string;

	constructor(body: any) {
		super();
		this["hub.topic"] = body["hub.topic"];
		this["hub.lease_seconds"] = body["hub.lease_seconds"];
		this["hub.mode"] = body["hub.mode"];
		this["hub.challenge"] = body["hub.challenge"];
	}
}