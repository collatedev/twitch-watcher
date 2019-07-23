import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import UserFollowRequestSchema from "../../api/UserFollowRequest.json";
import { ValidationSchema } from "@collate/request-validator";

export default class NewFollowerRouter extends TopicRouter {	
	constructor() {
		super('/follow/new', new ValidationSchema(UserFollowRequestSchema));
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		Logger.info(`New Follower webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}