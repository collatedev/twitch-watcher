import Router from "./Router";
import * as Express from "express";
import HookController from "../controllers/HookController";
import ErrorMessage from "../schemas/ErrorMessage";
import TwitchUserModel from "../models/TwitchUserModel";

export default class HookRouter extends Router {
	private hookController : HookController;
	
	constructor(twitchUserModel: TwitchUserModel) {
		super('/hooks');
		this.hookController = new HookController(twitchUserModel); 
	}

	public setup() : void {
		this.router.get('/:userID', this.getUserRoute);
	}

	public async getUserRoute(req: Express.Request, res: Express.Response) {
		let userID = parseInt(req.params.userID, 10);
		if (!this.isValidID(userID)) {
			res.status(400).send(
				new ErrorMessage(
					`The Twitch User ID must be an integer value, instead received ${userID}`
				)
			);
		} else {
			res.send(await this.hookController.getUserInfo(userID)).status(200);
		}
	}
	
	private isValidID(userID: number) {
		return !isNaN(userID) && this.isInt(userID);
	}

	private isInt(n: number) {
		return n % 1 == 0;
	}
}