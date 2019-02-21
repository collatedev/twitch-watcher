import SecretGenerator from "../../src/twitch/SecretGenerator";

export default class FakeSecretGenerator extends SecretGenerator {
	private secret: string;

	constructor(secret: string) {
		super("");
		this.secret = secret;
	}

	public generateSecret(length: number) {
		return this.secret;
	}
}