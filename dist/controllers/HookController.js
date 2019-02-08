"use strict";
exports.__esModule = true;
var TwitchUser_1 = require("../models/TwitchUser");
var HookController = /** @class */ (function () {
    function HookController() {
    }
    HookController.prototype.getUser = function () {
        return new TwitchUser_1["default"](1);
    };
    return HookController;
}());
exports["default"] = HookController;
