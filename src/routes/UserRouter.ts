import Router from "./Router";
import { Response, Request } from "express";
import StatusCodes from "./StatusCodes";
import TwitchUser from "../schemas/user/TwitchUser";
import { ValidationSchema, IValidationSchema } from "@collate/request-validator";
import GetUserRequestSchema from "../api/GetUserRequest.json";
import { ILogger } from "@collate/logging";
import IUserLayer from "../layers/IUserLayer";

export default class UserRouter extends Router {
	private userLayer : IUserLayer;
	
	constructor(userLayer: IUserLayer, logger : ILogger) {
		super('/user', logger);
		this.userLayer = userLayer; 
		this.handleGetUserByID = this.handleGetUserByID.bind(this);
	}

	public setup() : void {
		this.get('/:userID', this.handleGetUserByID, new ValidationSchema(GetUserRequestSchema));
	}

	public async handleGetUserByID(request: Request, response: Response) : Promise<void> {
		await this.getUserByID(response, parseInt(request.params.userID, 10));
	}
	
	public getSchema() : IValidationSchema {
		return new ValidationSchema(GetUserRequestSchema);
	}

	private async getUserByID(response: Response, userID: number) : Promise<void> {
		try {
			const user : TwitchUser = await this.userLayer.getUserInfo(userID);
			this.logger.info(`Successfully got user: ${JSON.stringify(user)}`);
			this.sendData(response, user, StatusCodes.OK);
		} catch (error) {
			this.logger.error(error);
			this.sendError(response, `Failed to get user with id: ${userID}`, StatusCodes.NotFound);
		}
	}
}