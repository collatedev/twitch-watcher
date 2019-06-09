import TopicRouter from "../../src/routes/TopicRouter";
import TestBody from "./TestBody";
import PartialValidator from "../../src/validators/PartialValidator";

export default class TestTopicRouter extends TopicRouter<TestBody> {    
	private static readonly TestBodyFields: string[] = ["a"];
    private shouldFail: boolean;

    constructor() {
		super('/test', new PartialValidator<TestBody>("Test Body", TestTopicRouter.TestBodyFields));
		this.shouldFail = false;
    }

    public failNextRequest() : void {
        this.shouldFail = true;
	}
	
	protected getBody(body: any) : TestBody {
		return new TestBody(body);
	}

    protected async handleWebhookData(body: TestBody): Promise<void> {
        if (this.shouldFail) {
            throw new Error('Failed to process data');
        }
        this.shouldFail = false;
    }
}