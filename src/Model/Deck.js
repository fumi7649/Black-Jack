"use strict";
exports.__esModule = true;
exports.Deck = void 0;
var Card_1 = require("./Card");
var Deck = /** @class */ (function () {
    function Deck(_gameType) {
        this._cards = [];
        this._gameType = _gameType;
        this._cards = _gameType === "blackjack" ? Deck.initialBlackJack() : [];
    }
    Deck.initialBlackJack = function () {
        var _cards = [];
        for (var suit in Deck.suits) {
            for (var rank in Deck.ranks) {
                var card = new Card_1.Card(suit, rank);
                _cards.push(card);
            }
        }
        return _cards;
    };
    Deck.prototype.shuffle = function () {
        for (var i = 0; i < this._cards.length; i++) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this._cards[i];
            this._cards[i] = this._cards[j];
            this._cards[j] = temp;
        }
    };
    Deck.prototype.resetDeck = function () {
        if (this._gameType === "blackjack") {
            this._cards = Deck.initialBlackJack();
            this.shuffle();
        }
    };
    Deck.prototype.drawOne = function () {
        return this._cards.pop();
    };
    Deck.suits = ["H", "D", "C", "S"];
    Deck.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return Deck;
}());
exports.Deck = Deck;
