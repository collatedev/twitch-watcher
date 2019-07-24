import TopicRouter from "../../src/routes/TopicRouter";
import TestBody from "./TestBody";
import { IValidationSchema } from "@collate/request-validator";
import FakeLogger from "../fakes/FakeLogger";
import { ILogger } from "@collate/logging";

const logger : ILogger = new FakeLogger();

export default class TestTopicRouter extends TopicRouter {    
    private shouldFail: boolean;

    constructor(schema : IValidationSchema) {
		super('/test', schema, logger);
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