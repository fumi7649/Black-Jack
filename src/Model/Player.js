"use strict";
exports.__esModule = true;
exports.Player = void 0;
var GameDecision_1 = require("./GameDecision");
var Player = /** @class */ (function () {
    function Player(_name, _type, _gameType, _chips) {
        if (_chips === void 0) { _chips = 400; }
        this._name = _name;
        this._type = _type;
        this._gameType = _gameType;
        this._chips = _chips;
        this._hand = [];
        this._bet = 0;
        this._winAmount = 0;
        this._gameStatus = "betting";
    }
    Object.defineProperty(Player.prototype, "get_name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "get_bet", {
        get: function () {
            return this._bet;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "get_winAmount", {
        get: function () {
            return this._winAmount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "get_gameStatus", {
        get: function () {
            return this._gameStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "set_bet", {
        set: function (amount) {
            this._bet = amount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "set_winAmount", {
        set: function (amount) {
            this._winAmount = amount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "set_gameStatus", {
        set: function (status) {
            this._gameStatus = status;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.promptPlayer = function (userData) {
        if (this._type === "ai" || this._type === "house")
            return this.get_aiDecision;
        if (this._gameStatus === "betting") {
            return new GameDecision_1.GameDecision("bet", userData);
        }
        else {
            return new GameDecision_1.GameDecision(userData, this._bet);
        }
    };
    Object.defineProperty(Player.prototype, "get_aiDecision", {
        get: function () {
            var betDenominations = [5, 20, 50, 100];
            var betDenominationCount = Player.getRandomInteger(1, 4);
            var betIndex = Player.getRandomInteger(0, 3);
            var _bet = 0;
            if (this._gameStatus === "betting") {
                for (var i = betDenominationCount; i > 0; i--) {
                    _bet += betDenominations[betIndex];
                }
                return new GameDecision_1.GameDecision("bet", _bet);
            }
            else {
                if (this.get_handScore < 15) {
                    return new GameDecision_1.GameDecision("hit", this._bet);
                }
                else {
                    return new GameDecision_1.GameDecision("stand", this._bet);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "get_hand", {
        get: function () {
            return this._hand;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "push_card", {
        set: function (card) {
            this._hand.push(card);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "reset_card", {
        set: function (cards) {
            this._hand = cards;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "get_handScore", {
        get: function () {
            var count = 0;
            var aces = [];
            for (var i = 0; i < this._hand.length; i++) {
                count += this._hand[i].get_rankNumber;
                if (this._hand[i].rank === "A")
                    aces.push("A");
            }
            while (count > 21 && aces.length > 0) {
                aces.pop();
                count -= 10;
            }
            return count;
        },
        enumerable: false,
        configurable: true
    });
    Player.getRandomInteger = function (min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    };
    return Player;
}());
exports.Player = Player;
