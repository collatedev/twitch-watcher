"use strict";
exports.__esModule = true;
var TwitchWebhook_1 = require("./TwitchWebhook");
var TwitchUser = /** @class */ (function () {
    function TwitchUser(id) {
        this.id = id;
        this.streamHook = new TwitchWebhook_1["default"]("callbackURL", "topicURL", new Date());
        this.userHook = new TwitchWebhook_1["default"]("callbackURL", "topicURL", new Date());
        this.followerHook = new TwitchWebhook_1["default"]("callbackURL", "topicURL", new Date());
    }
    return TwitchUser;
}());
exports["default"] = TwitchUser;
