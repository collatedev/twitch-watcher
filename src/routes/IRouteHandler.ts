import { Request, Response } from "express";
import { NextFunction } from "connect";

type IRouteHandler = (request: Request, response: Response, next : NextFunction | undefined) => void;

export default IRouteHandler;