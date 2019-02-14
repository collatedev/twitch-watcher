import TopicRouter from "../../src/routes/TopicRouter";

const TestBodyFields : Array<string> = [];

export default class TestTopicRouter extends TopicRouter<{}> {    
    private shouldFail: boolean

    constructor() {
        super('/test', TestBodyFields);
    }

    public failNextRequest() {
        this.shouldFail = true;
    }

    protected async handleWebhookData(body: {}): Promise<void> {
        if (this.shouldFail) {
            throw new Error('failed processing data');
        }
        this.shouldFail = false;
    }
}