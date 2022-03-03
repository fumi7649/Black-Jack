"use strict";
exports.__esModule = true;
exports.Card = void 0;
var Card = /** @class */ (function () {
    function Card(_suit, _rank) {
        this._suit = _suit;
        this._rank = _rank;
    }
    Object.defineProperty(Card.prototype, "suit", {
        get: function () {
            return this.suit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "rank", {
        get: function () {
            return this._rank;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "get_rankNumber", {
        get: function () {
            if (this._rank === "A")
                return 11;
            else if (this._rank === "J" || this._rank === "Q" || this._rank === "K")
                return 10;
            else
                return parseInt(this._rank);
        },
        enumerable: false,
        configurable: true
    });
    return Card;
}());
exports.Card = Card;
