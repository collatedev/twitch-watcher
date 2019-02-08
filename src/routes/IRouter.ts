import {Router} from "express";

export default interface IRouter {
    setup(): void;
    getPath(): string;
    getRouter(): Router;
}