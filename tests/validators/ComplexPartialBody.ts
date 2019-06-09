import Validatable from "../../src/validators/Validatable";

export default class ComplexBody extends Validatable {
	public a: string;
	public b: string;
	public c: string;
	public d: string;

	constructor(body: any) {
		super();
		this.a = body.a;
		this.b = body.b;
		this.c = body.c;
		this.d = body.d;
	}
}