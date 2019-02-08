import Router from "./Router";
import * as Express from "express";
import HookController from "../controllers/HookController";

export default class HookRouter extends Router {
    private hookController : HookController;
    
    constructor() {
        super('/hooks'); 
        this.hookController = new HookController();
    }

    public setup() {
        this.router.get('/:userID', (req: Express.Request, res: Express.Response) => {
            res.send(this.hookController.getUserInfo(req.params.userID)).status(200);
        });
    }
}