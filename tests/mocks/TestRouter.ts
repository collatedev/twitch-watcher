import Router from "../../src/routes/Router";
import { Response, Request } from "express";
import StatusCodes from "../../src/routes/StatusCodes";

export default class TestRouter extends Router {
	constructor() {
		super("/test");
	}

	public setup(): void {
		this.router.get('/a', (response: Response, request: Request): void => {
			response.send("test").status(StatusCodes.OK);
		});
	}
}