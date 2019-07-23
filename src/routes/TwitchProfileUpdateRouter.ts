import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import TwitchProfileUpdateRequestSchema from "../../api/TwitchProfileUpdateRequest.json";
import { ValidationSchema } from "@collate/request-validator";

export default class TwitchProfileUpdateRouter extends TopicRouter {	
    constructor() {
		super('/user', new ValidationSchema(TwitchProfileUpdateRequestSchema));
    }

    protected async handleWebhookData(rawBody: any): Promise<void> {
		Logger.info(`Twitch Profile Update webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}