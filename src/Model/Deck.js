"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const Card_1 = require("./Card");
class Deck {
    constructor(_gameType) {
        this._cards = [];
        this._gameType = _gameType;
        this._cards = _gameType === "blackjack" ? Deck.initialBlackJack() : [];
    }
    static initialBlackJack() {
        let _cards = [];
        for (let suit of Deck.suits) {
            for (let rank of Deck.ranks) {
                let card = new Card_1.Card(suit, rank);
                _cards.push(card);
            }
        }
        return _cards;
    }
    shuffle() {
        for (let i = 0; i < this._cards.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this._cards[i];
            this._cards[i] = this._cards[j];
            this._cards[j] = temp;
        }
    }
    resetDeck() {
        if (this._gameType === "blackjack") {
            this._cards = Deck.initialBlackJack();
            this.shuffle();
        }
    }
    drawOne() {
        return this._cards.pop();
    }
}
exports.Deck = Deck;
Deck.suits = ["heart", "diamond", "clover", "spade"];
Deck.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
