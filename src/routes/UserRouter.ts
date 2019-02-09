import Router from "./Router";
import * as Express from "express";
import UserLayer from "../layers/UserLayer";
import ErrorMessage from "../schemas/ErrorMessage";
import UserModel from "../models/UserModel";
import DataMessage from "../schemas/DataMessage";

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
		if (!this.isValidID(userID)) {
			response
				.json(new ErrorMessage(`The Twitch User ID must be a positive integer value, instead received '${userID}'`))
				.status(400);
		} else {
			await this.sendUserData(response, userID);
		}
		
	}

	private async sendUserData(response: Express.Response, userID: number) {
		try {
			let user = await this.userLayer.getUserInfo(userID);
			response
				.json(new DataMessage(user))
				.status(200);
		} catch (error) {
			response
				.json(new ErrorMessage(`Failed to get user with id: ${userID}`))
				.status(404);
		}
	}
	
	private isValidID(userID: number) {
		return !isNaN(userID) && this.isInt(userID) && userID > -1;
	}

	private isInt(n: number) {
		return n % 1 == 0;
	}
}