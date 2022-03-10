"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDecision = void 0;
class GameDecision {
    constructor(action, amount) {
        this.action = action;
        this.amount = amount;
    }
    get get_action() {
        return this.action;
    }
    get get_amount() {
        return this.amount;
    }
}
exports.GameDecision = GameDecision;
