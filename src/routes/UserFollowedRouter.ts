import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import UserFollowRequestSchema from "../../api/UserFollowRequest.json";
import { ValidationSchema } from "@collate/request-validator";

export default class UserFollowedRouter extends TopicRouter {	
    constructor() {
		super('/follow/followed', new ValidationSchema(UserFollowRequestSchema));
    }

    protected async handleWebhookData(rawBody: any): Promise<void> {
		Logger.info(`User Followed webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}