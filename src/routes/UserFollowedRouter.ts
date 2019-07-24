import TopicRouter from "./TopicRouter";
import UserFollowRequestSchema from "../api/UserFollowRequest.json";
import { ValidationSchema } from "@collate/request-validator";
import { ILogger } from "@collate/logging";

export default class UserFollowedRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/follow/followed', new ValidationSchema(UserFollowRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`User Followed webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}