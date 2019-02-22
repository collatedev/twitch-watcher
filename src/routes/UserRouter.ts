import Router from "./Router";
import { Response, Request } from "express";
import UserLayer from "../layers/UserLayer";
import StatusCodes from "./StatusCodes";
import { Logger } from "../config/Winston";
import TwitchUser from "../schemas/user/TwitchUser";

export default class UserRouter extends Router {
	private userLayer : UserLayer;
	
	constructor(userLayer: UserLayer) {
		super('/user');
		this.userLayer = userLayer; 
		this.handleGetUserByID = this.handleGetUserByID.bind(this);
	}

	public setup() : void {
		this.router.get('/:userID', this.handleGetUserByID);
	}

	public async handleGetUserByID(request: Request, response: Response) : Promise<void> {
		const userID : number = parseFloat(request.params.userID);
		if (!this.isValidID(userID)) {
			Logger.error(`Illegal userID: '${userID}'`);
			this.sendError(
				response, 
				`The Twitch User ID must be a positive integer value, instead received '${userID}'`, 
				StatusCodes.BadRequest
			);
		} else {
			await this.getUserByID(response, userID);
		}
	}

	private async getUserByID(response: Response, userID: number) : Promise<void> {
		try {
			const user : TwitchUser = await this.userLayer.getUserInfo(userID);
			Logger.info(`Successfully got user: ${JSON.stringify(user)}`);
			this.sendData(response, user, StatusCodes.OK);
		} catch (error) {
			Logger.error(error);
			this.sendError(response, `Failed to get user with id: ${userID}`, StatusCodes.NotFound);
		}
	}
	
	private isValidID(userID: number) : boolean {
		return !isNaN(userID) && this.isInt(userID) && userID > -1;
	}

	private isInt(n: number) : boolean {
		return n % 1 === 0;
	}
}