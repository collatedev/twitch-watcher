import TopicRouter from "./TopicRouter";
import { Logger } from "../config/Winston";
import StreamBody from "../schemas/request/StreamBody";
import IRequestBuilder from "../request_builder/IRequestBuilder";

export default class StreamRouter extends TopicRouter<StreamBody> {	
	private requestBuilder : IRequestBuilder;

    constructor(requestBuilder : IRequestBuilder) {
		super('/streams', StreamBody.Validator);
		this.requestBuilder = requestBuilder;
    }

    protected async handleWebhookData(body: StreamBody): Promise<void> {
		Logger.info(`Stream webhook recieved body: ${body}`);
		await this.requestBuilder.makeRequest("", {});	// put message onto the message queue
	}
	
	protected getBody(body: any) : StreamBody {
		return new StreamBody(body);
	}
}