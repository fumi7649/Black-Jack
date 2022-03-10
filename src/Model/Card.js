"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
class Card {
    constructor(_suit, _rank) {
        this._suit = _suit;
        this._rank = _rank;
    }
    get suit() {
        return this._suit;
    }
    get rank() {
        return this._rank;
    }
    get get_rankNumber() {
        if (this._rank === "A")
            return 11;
        else if (this._rank === "J" || this._rank === "Q" || this._rank === "K")
            return 10;
        else
            return parseInt(this._rank);
    }
}
exports.Card = Card;
