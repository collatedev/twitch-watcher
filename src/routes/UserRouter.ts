import Router from "./Router";
import * as Express from "express";
import UserLayer from "../layers/UserLayer";

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
		let userID = parseFloat(request.params.userID);
		if (this.isValidID(userID)) {
			await this.sendUserData(response, userID);
		} else {
			this.sendError(response, `The Twitch User ID must be a positive integer value, instead received '${userID}'`, 400);
		}
		
	}

	private async sendUserData(response: Express.Response, userID: number) {
		try {
			let user = await this.userLayer.getUserInfo(userID);
			this.sendData(response, user, 200);
		} catch (error) {
			this.sendError(response, `Failed to get user with id: ${userID}`, 404);
		}
	}
	
	private isValidID(userID: number) {
		return !isNaN(userID) && this.isInt(userID) && userID > -1;
	}

	private isInt(n: number) {
		return n % 1 == 0;
	}
}