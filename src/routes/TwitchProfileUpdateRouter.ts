import TopicRouter from "./TopicRouter";
import { Logger } from "../logging/Winston";
import TwitchProfileUpdateBody from "../schemas/request/TwitchProfileUpdateBody";

export default class TwitchProfileUpdateRouter extends TopicRouter<TwitchProfileUpdateBody> {	
    constructor() {
		super('/user', TwitchProfileUpdateBody.Validator);
    }

    protected async handleWebhookData(body: TwitchProfileUpdateBody): Promise<void> {
		Logger.info(`Twitch Profile Update webhook recieved body: ${JSON.stringify(body)}`);
	}
	
	protected getBody(body: any) : TwitchProfileUpdateBody {
		return new TwitchProfileUpdateBody(body);
	}
}