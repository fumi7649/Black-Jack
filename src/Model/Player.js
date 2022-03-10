"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const GameDecision_1 = require("./GameDecision");
class Player {
    constructor(_name, _type, _gameType, _chips = 400) {
        this._name = _name;
        this._type = _type;
        this._gameType = _gameType;
        this._chips = _chips;
        this._hand = [];
        this._bet = 0;
        this._winAmount = 0;
        this._gameStatus = this.type === "house" ? "WaitingForBets" : "betting";
    }
    get get_name() {
        return this._name;
    }
    get get_chips() {
        return this._chips;
    }
    get get_bet() {
        return this._bet;
    }
    get get_winAmount() {
        return this._winAmount;
    }
    get get_gameStatus() {
        return this._gameStatus;
    }
    get type() {
        return this._type;
    }
    set set_bet(amount) {
        this._bet = amount;
    }
    set set_winAmount(amount) {
        this._winAmount = amount;
    }
    set set_gameStatus(status) {
        this._gameStatus = status;
    }
    set set_chips(n) {
        this._chips += n;
    }
    promptPlayer(userData) {
        if (this._type === "ai" || this._type === "house" || userData === null)
            return this.get_aiDecision;
        if (this._gameStatus === "betting") {
            return new GameDecision_1.GameDecision("bet", userData);
        }
        else {
            return new GameDecision_1.GameDecision(userData, this._bet);
        }
    }
    get get_aiDecision() {
        const betDenominations = [5, 20, 50, 100];
        let betDenominationCount = Player.getRandomInteger(1, 4);
        let betIndex = Player.getRandomInteger(0, 3);
        let bet = 0;
        if (this._gameStatus === "betting") {
            for (let i = betDenominationCount; i > 0; i--) {
                bet += betDenominations[betIndex];
            }
            return new GameDecision_1.GameDecision("bet", bet);
        }
        else {
            if (this.get_handScore < 15) {
                return new GameDecision_1.GameDecision("hit", this._bet);
            }
            else {
                return new GameDecision_1.GameDecision("stand", this._bet);
            }
        }
    }
    get get_hand() {
        return this._hand;
    }
    set push_card(card) {
        this._hand.push(card);
    }
    set reset_card(cards) {
        this._hand = cards;
    }
    get get_handScore() {
        let count = 0;
        let aces = [];
        for (let i = 0; i < this._hand.length; i++) {
            count += this._hand[i].get_rankNumber;
            if (this._hand[i].rank === "A")
                aces.push("A");
        }
        while (count > 21 && aces.length > 0) {
            aces.pop();
            count -= 10;
        }
        return count;
    }
    static getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
}
exports.Player = Player;
