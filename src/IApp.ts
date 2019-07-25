import { IRouter } from "@collate/router";

export default interface IApp {
    initialize() : void;
    start(port : number) : void;
    addRouter(router : IRouter) : void;
}