import TopicRouter from "../../src/routes/TopicRouter";
import TestBody from "./TestBody";
import { ValidationSchema } from "@collate/request-validator";
import TestTopicSchema from "../api/TestTopic.json";

export default class TestTopicRouter extends TopicRouter {    
    private shouldFail: boolean;

    constructor() {
		super('/test', new ValidationSchema(TestTopicSchema));
		this.shouldFail = false;
    }

    public failNextRequest() : void {
        this.shouldFail = true;
	}
	
	protected getBody(body: any) : TestBody {
		return new TestBody(body);
	}

    protected async handleWebhookData(rawBody: any): Promise<void> {
        if (this.shouldFail) {
            throw new Error('Failed to process data');
        }
        this.shouldFail = false;
    }
}