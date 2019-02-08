"use strict";
exports.__esModule = true;
var TwitchWebhook = /** @class */ (function () {
    function TwitchWebhook(callbackURL, topicURL, expirationDate) {
        this.callbackURL = callbackURL;
        this.topicURL = topicURL;
        this.expirationDate = expirationDate;
    }
    return TwitchWebhook;
}());
exports["default"] = TwitchWebhook;
