import TopicRouter from "./TopicRouter";
import WebhookBody from "../schemas/ChallengeBody";
import { Logger } from "../config/Winston";
import StreamBody from "../schemas/StreamBody";

/* This is stored outside the class so the fields can be 
 * accessed by super and passed to the topic router to 
 * create the Body Validator
*/
const StreamBodyFields : Array<string> = [];

export default class StreamRouter extends TopicRouter<StreamBody> {    
    constructor() {
        super('/streams', StreamBodyFields);
    }

    protected async handleWebhookData(body: WebhookBody): Promise<void> {
        Logger.info(body);
        //send data to message bus
        console.log(body);
    }
}