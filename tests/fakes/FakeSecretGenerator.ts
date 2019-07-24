import ISecretGenerator from "../../src/twitch/ISecretGenerator";

export default class FakeSecretGenerator implements ISecretGenerator {
	private secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	public generate(length: number) : string {
		return this.secret;
	}
}