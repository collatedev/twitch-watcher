import Router from "./Router";
import * as Express from "express";
import HookController from "../controllers/HookController";
import ErrorMessage from "../schemas/ErrorMessage";

export default class HookRouter extends Router {
    private hookController : HookController;
    
    constructor() {
        super('/hooks'); 
        this.hookController = new HookController();
    }

    public setup() {
        this.router.get('/:userID', async (req: Express.Request, res: Express.Response) => {
			let userID = parseInt(req.params.userID, 10);
			console.log(userID);
			if (isNaN(userID) || !this.isInt(userID)) {
				res.send(new ErrorMessage(
					`The Twitch User ID must be an integer value, instead received ${userID}`)
				).status(400);
			} else {
				res.send(await this.hookController.getUserInfo(userID)).status(200);
			}
        });
	}
	
	private isInt(n: number) {
		return n % 1 == 0;
	}
}