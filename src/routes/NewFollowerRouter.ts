import TopicRouter from "./TopicRouter";
import UserFollowRequestSchema from "../api/UserFollowRequest.json";
import { ValidationSchema } from "@collate/request-validator";
import { ILogger } from "@collate/logging";

export default class NewFollowerRouter extends TopicRouter {	
	constructor(logger : ILogger) {
		super('/follow/new', new ValidationSchema(UserFollowRequestSchema), logger);
	}

	protected async handleWebhookData(rawBody: any): Promise<void> {
		this.logger.info(`New Follower webhook recieved body: ${JSON.stringify(rawBody)}`);
	}
}