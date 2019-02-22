export default class SecretGenerator {
	private alphabet: string;

	constructor(alphabet: string) {
		this.alphabet = alphabet;
	}

	public generateSecret(length: number) : string {
		let secret : string = "";
		for (let i : number = 0; i < length; i++) {
			secret += this.alphabet.charAt(
				// TODO: Replace with secure random generator
				Math.floor(Math.random() * this.alphabet.length)
			);
		}
		return secret;
	}
}