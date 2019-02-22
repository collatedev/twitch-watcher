import Validatable from "../../src/validators/Validatable";

export default class TestBody extends Validatable {
	public a: string;
	public b: boolean;
	public c: number;
	
	constructor(body: any) {
		super();
		this.a = body.a;
		this.b = body.b;
		this.c = body.c;
	}
}