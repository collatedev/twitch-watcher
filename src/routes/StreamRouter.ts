import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import StreamRequestSchema from "../../api/StreamRequest.json";
import { ValidationSchema } from "@collate/request-validator";

export default class StreamRouter extends TopicRouter {	
    constructor() {
		  super('/streams', new ValidationSchema(StreamRequestSchema));
    }

    protected async handleWebhookData(rawBody: any): Promise<void> {
		Logger.info(`Stream webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}