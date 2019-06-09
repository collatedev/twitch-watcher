import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import StreamBody from "../schemas/request/StreamBody";

export default class StreamRouter extends TopicRouter<StreamBody> {	
    constructor() {
		super('/streams', StreamBody.Validator);
    }

    protected async handleWebhookData(body: StreamBody): Promise<void> {
		Logger.info(`Stream webhook recieved body: ${JSON.stringify(body)}`);
	}
	
	protected getBody(body: any) : StreamBody {
		return new StreamBody(body);
	}
}