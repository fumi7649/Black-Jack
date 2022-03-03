"use strict";
exports.__esModule = true;
exports.GameDecision = void 0;
var GameDecision = /** @class */ (function () {
    function GameDecision(action, amount) {
        this.action = action;
        this.amount = amount;
    }
    Object.defineProperty(GameDecision.prototype, "get_action", {
        get: function () {
            return this.action;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameDecision.prototype, "get_amount", {
        get: function () {
            return this.amount;
        },
        enumerable: false,
        configurable: true
    });
    return GameDecision;
}());
exports.GameDecision = GameDecision;
