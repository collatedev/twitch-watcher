import Router from "./Router";
import { Response, Request } from "express";
import UserLayer from "../layers/UserLayer";
import StatusCodes from "./StatusCodes";
import { Logger } from "../logging/Winston";
import TwitchUser from "../schemas/user/TwitchUser";
import { ValidationSchema } from "@collate/request-validator";
import GetUserRequestSchema from "../../api/GetUserRequest.json";

export default class UserRouter extends Router {
	private userLayer : UserLayer;
	
	constructor(userLayer: UserLayer) {
		super('/user');
		this.userLayer = userLayer; 
		this.handleGetUserByID = this.handleGetUserByID.bind(this);
	}

	public setup() : void {
		this.get('/:userID', this.handleGetUserByID, new ValidationSchema(GetUserRequestSchema));
	}

	public async handleGetUserByID(request: Request, response: Response) : Promise<void> {
		await this.getUserByID(response, parseInt(request.params.userID, 10));
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
}