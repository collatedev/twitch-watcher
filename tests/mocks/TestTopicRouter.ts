import TopicRouter from "../../src/routes/TopicRouter";
import TestBody from "./TestBody";

const TestBodyFields : string[] = ["a"];

export default class TestTopicRouter extends TopicRouter<TestBody> {    
    private shouldFail: boolean;

    constructor() {
		super('/test', TestBodyFields);
		this.shouldFail = false;
    }

    public failNextRequest() : void {
        this.shouldFail = true;
    }

    protected async handleWebhookData(body: TestBody): Promise<void> {
        if (this.shouldFail) {
            throw new Error('Failed to process data');
        }
        this.shouldFail = false;
    }
}