import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import StreamBody from "../schemas/request/StreamBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";

export default class StreamRouter extends TopicRouter<StreamBody> {	
    constructor(requestBuilder : IRequestBuilder) {
		super('/streams', StreamBody.Validator);
    }

    protected async handleWebhookData(body: StreamBody): Promise<void> {
		Logger.info(`Stream webhook recieved body: ${JSON.stringify(body)}`);
	}
	
	protected getBody(body: any) : StreamBody {
		return new StreamBody(body);
	}
}