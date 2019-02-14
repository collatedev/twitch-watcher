import TopicRouter from "./TopicRouter";
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

    protected async handleWebhookData(body: StreamBody): Promise<void> {
		Logger.info(`Stream webhook recieved body: ${body}`);
		
    }
}