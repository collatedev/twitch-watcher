import Router from "../../src/routes/Router";
import { Response, Request } from "express";
import StatusCodes from "../../src/routes/StatusCodes";
import { ValidationSchema } from "@collate/request-validator";
import FakeLogger from "../fakes/FakeLogger";
import { ILogger } from "@collate/logging";

const logger : ILogger = new FakeLogger();

export default class TestRouter extends Router {
	constructor() {
		super("/test", logger);
	}

	public setup(): void {
		this.get('/a', (request: Request, response: Response): void => {
			response.send("test").status(StatusCodes.OK);
		}, new ValidationSchema({
			types: {
				request: {
					body: {
						type: "string",
						required: true
					}
				}
			}
		}));
	}
}