import TopicRouter from "../../src/routes/TopicRouter";
import TestBody from "./TestBody";
import PartialValidator from "../../src/validators/PartialValidator";
import { ValidationSchema } from "@collate/request-validator";

export default class TestTopicRouter extends TopicRouter {    
	private static readonly TestBodyFields: string[] = ["a"];
    private shouldFail: boolean;

    constructor() {
		super('/test', new ValidationSchema({
            types: {
                request: {
                    body: {
                        type: "body",
                        required: true
                    },
                },
                body: {
                    a: {
                        type: "boolean",
                        required: true
                    }         
                }
            }
        }));
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