import TopicRouter from "../../src/routes/TopicRouter";
import Validatable from "../../src/validators/Validatable";

const TestBodyFields : Array<string> = [];

class TestBody extends Validatable {

}

export default class TestTopicRouter extends TopicRouter<TestBody> {    
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