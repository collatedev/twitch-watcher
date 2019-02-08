"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Router_1 = require("./Router");
var HookController_1 = require("../controllers/HookController");
var HookRouter = /** @class */ (function (_super) {
    __extends(HookRouter, _super);
    function HookRouter() {
        var _this = _super.call(this, '/hooks') || this;
        _this.hookController = new HookController_1["default"]();
        return _this;
    }
    HookRouter.prototype.setup = function () {
        var _this = this;
        this.router.get('/', function (req, res) {
            res.send(_this.hookController.getUser()).status(200);
        });
    };
    return HookRouter;
}(Router_1["default"]));
exports["default"] = HookRouter;
