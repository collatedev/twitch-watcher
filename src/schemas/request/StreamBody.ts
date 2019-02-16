import Validatable from "../../validators/Validatable";
import IStreamBody from "./IStreamBody";
import IStreamData from "./IStreamData";

export default class StreamBody extends Validatable implements IStreamBody {
	data: Array<IStreamData>;

	constructor(body: any) {
		super();
		this.data = body.data;
	}
}