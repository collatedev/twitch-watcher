"use strict";
exports.__esModule = true;
var Express = require("express");
var BodyParser = require("body-parser");
var App = /** @class */ (function () {
    function App() {
        this.app = Express();
    }
    App.prototype.initialize = function () {
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({
            extended: false
        }));
    };
    App.prototype.start = function (port) {
        this.app.listen(port, function () {
            console.log("Server is listening on port " + port);
        });
    };
    App.prototype.addRouter = function (router) {
        router.setup();
        this.app.use(router.getPath(), router.getRouter());
    };
    return App;
}());
exports["default"] = App;
