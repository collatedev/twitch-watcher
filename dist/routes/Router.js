"use strict";
exports.__esModule = true;
var Express = require("express");
var Path = require("path");
var ExpressRouter = Express.Router();
var RootPath = '/api/v1/';
var Router = /** @class */ (function () {
    function Router(path) {
        this.router = ExpressRouter;
        this.basePath = path;
    }
    Router.prototype.getPath = function () {
        return Path.join(RootPath, this.basePath);
    };
    Router.prototype.getRouter = function () {
        return ExpressRouter;
    };
    return Router;
}());
exports["default"] = Router;
