export default class SecretGenerator {
	public static DefaultAlphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()";

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