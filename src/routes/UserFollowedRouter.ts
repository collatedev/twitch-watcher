import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import FollowBody from "../schemas/request/FollowBody";

export default class UserFollowedRouter extends TopicRouter<FollowBody> {	
    constructor() {
		super('/follow/followed', FollowBody.Validator);
    }

    protected async handleWebhookData(body: FollowBody): Promise<void> {
		Logger.info(`User Followed webhook recieved body: ${JSON.stringify(body)}`);
	}
	
	protected getBody(body: any) : FollowBody {
		return new FollowBody(body);
	}
}