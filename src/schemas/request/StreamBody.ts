import IStreamBody from "./IStreamBody";
import IStreamData from "./IStreamData";
import Validatable from "../../validators/Validatable";

export default class StreamBody extends Validatable implements IStreamBody {
	data: IStreamData[];
	
	constructor(body: any) {
		super();
		this.data = body.data;
	}
}