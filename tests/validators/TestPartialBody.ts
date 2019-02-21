import Validatable from "../../src/validators/Validatable";

export default class TestPartialBody extends Validatable {
	public a: string;
	
	constructor(body: any) {
		super();
		this.a = body.a;
	}
}