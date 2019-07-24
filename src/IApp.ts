import IRouter from "./routes/IRouter";

export default interface IApp {
    initialize() : void;
    start(port : number) : void;
    addRouter(router : IRouter) : void;
}