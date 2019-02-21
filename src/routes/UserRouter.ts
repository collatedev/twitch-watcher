import Router from "./Router";
import * as Express from "express";
import UserLayer from "../layers/UserLayer";
import StatusCodes from "./StatusCodes";
import { Logger } from "../config/Winston";

export default class UserRouter extends Router {
	private userLayer : UserLayer;
	
	constructor(userLayer: UserLayer) {
		super('/user');
		this.userLayer = userLayer; 
		this.getUserByID = this.getUserByID.bind(this);
	}

	public setup() : void {
		this.router.get('/:userID', this.getUserByID);
	}

	public async getUserByID(request: Express.Request, response: Express.Response) {
		const userID = parseFloat(request.params.userID);
		if (!this.isValidID(userID)) {
			Logger.error("")
			this.sendError(response, `The Twitch User ID must be a positive integer value, instead received '${userID}'`, StatusCodes.BadRequest);
		}
		try {
			const user = await this.userLayer.getUserInfo(userID);
			Logger.info(`Successfully got user: ${JSON.stringify(user)}`);
			this.sendData(response, user, StatusCodes.OK);
		} catch (error) {
			Logger.error(error);
			this.sendError(response, `Failed to get user with id: ${userID}`, StatusCodes.NotFound);
		}
	}
	
	private isValidID(userID: number) {
		return !isNaN(userID) && this.isInt(userID) && userID > -1;
	}

	private isInt(n: number) {
		return n % 1 === 0;
	}
}