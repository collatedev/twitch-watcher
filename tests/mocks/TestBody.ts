import Validatable from "../../src/validators/Validatable";

export default class TestBody extends Validatable {
	public a: boolean;

	constructor(body: any) {
		super();
		this. a = body.a;
	}
}