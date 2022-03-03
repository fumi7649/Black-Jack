"use strict";
exports.__esModule = true;
exports.Table = void 0;
var Player_1 = require("./Player");
var Deck_1 = require("./Deck");
var Table = /** @class */ (function () {
    function Table(_gameType, _betDenomination) {
        if (_betDenomination === void 0) { _betDenomination = [5, 20, 50, 100]; }
        this._players = [];
        this._gamePhase = 'betting';
        this._gameType = _gameType;
        this._betDenomination = _betDenomination;
        this._deck = new Deck_1.Deck(this._gameType);
        this._house = new Player_1.Player('house', 'house', this._gameType);
        this._resultLog = [];
        this._turnCounter = 0;
    }
    Object.defineProperty(Table.prototype, "set_gamePhase", {
        set: function (gamePhase) {
            this._gamePhase = gamePhase;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "set_player", {
        set: function (player) {
            this._players.push(player);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "get_gamePhase", {
        get: function () {
            return this._gamePhase;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "get_resultLog", {
        get: function () {
            return this._resultLog;
        },
        enumerable: false,
        configurable: true
    });
    Table.prototype.evaluateMove = function (player, userData) {
        var gameDecision = player.promptPlayer(userData);
        if (gameDecision.get_action === "bet") {
            player.set_bet = gameDecision.get_amount;
            player.set_winAmount = gameDecision.get_amount;
            player.set_gameStatus = "bet";
        }
        if (gameDecision.get_action === "stand") {
            if (player.get_hand.length === 2 && player.get_handScore === 21)
                player.set_gameStatus = "blackjack";
            else {
                player.set_gameStatus = "stand";
            }
        }
        if (gameDecision.get_action === "hit") {
            player.set_gameStatus = "hit";
            player.push_card = this._deck.drawOne();
            if (player.get_handScore > 21)
                player.set_gameStatus = "bust";
        }
        if (gameDecision.get_action === "surrender") {
            player.set_bet = Math.floor(player.get_bet / 2);
            player.set_winAmount = Math.floor(player.get_winAmount / 2);
            player.set_gameStatus = "surrender";
        }
    };
    Table.prototype.blackjackEvaluateAndGetRoundResults = function () {
        var s = "";
        for (var i = 0; i < this._players.length; i++) {
            var currentPlayer = this._players[i];
            if (currentPlayer.get_gameStatus === "bust" || currentPlayer.get_gameStatus === "surrender" || currentPlayer.get_gameStatus === "broken") {
                s += "|name: ".concat(currentPlayer.get_name, ", action: ").concat(currentPlayer.get_gameStatus, ", bet: ").concat(currentPlayer.get_bet, ", won: -").concat(currentPlayer.get_winAmount, "|");
            }
            if (this._house.get_gameStatus === "blackjack" && currentPlayer.get_gameStatus === "blackjack") {
                s += "|name: ".concat(currentPlayer.get_name, ", action: ").concat(currentPlayer.get_gameStatus, ", bet: ").concat(currentPlayer.get_bet, ", won: ").concat(currentPlayer.get_winAmount, "|");
            }
            if (currentPlayer.get_gameStatus === "blackjack") {
                s += "|name: ".concat(currentPlayer.get_name, ", action: ").concat(currentPlayer.get_gameStatus, ", bet: ").concat(currentPlayer.get_bet, ", won: ").concat(currentPlayer.get_winAmount * 1.5, "|");
            }
            else {
                if (this._house.get_handScore < currentPlayer.get_handScore) {
                    s += "|name: ".concat(currentPlayer.get_name, ", action: ").concat(currentPlayer.get_gameStatus, ", bet: ").concat(currentPlayer.get_bet, ", won: ").concat(currentPlayer.get_winAmount, "|");
                }
                else {
                    s += "|name: ".concat(currentPlayer.get_name, ", action: ").concat(currentPlayer.get_gameStatus, ", bet: ").concat(currentPlayer.get_bet, ", won: -").concat(currentPlayer.get_winAmount, "|");
                }
            }
        }
        this._resultLog.push(s);
    };
    Table.prototype.blackjackAssignPlayerHands = function () {
        for (var i = 0; i < 2; i++) {
            this._house.push_card = this._deck.drawOne();
        }
        for (var i = 0; i < this._players.length; i++) {
            var j = 2;
            var currentPlayer = this._players[i];
            while (j > 0) {
                currentPlayer.push_card = this._deck.drawOne();
            }
        }
    };
    Table.prototype.blackjackClearPlayerHandsAndBets = function () {
        for (var i = 0; i < this._players.length; i++) {
            var currentPlayer = this._players[i];
            if (currentPlayer.get_hand.length > 0)
                currentPlayer.reset_card = [];
        }
        if (this._house.get_hand.length > 0)
            this._house.reset_card = [];
    };
    Object.defineProperty(Table.prototype, "turnPlayer", {
        get: function () {
            var index = this._turnCounter % this._players.length;
            return this._players[index];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * haveTurn
userData: any     */
    Table.prototype.haveTurn = function (userData) {
        var currentPlayer = this.turnPlayer;
        if (this._gamePhase === "betting") {
            if (this.onFirstPlayer()) {
                this.blackjackClearPlayerHandsAndBets();
            }
            this.evaluateMove(currentPlayer, userData);
            if (this.onLastPlayer())
                this.set_gamePhase = "acting";
        }
        if (this._gamePhase === "acting") {
            if (this.onFirstPlayer())
                this.blackjackAssignPlayerHands();
            this.evaluateMove(currentPlayer, userData);
            if (this.onFirstPlayer() && this.allPlayerActionsResolved()) {
                this.blackjackEvaluateAndGetRoundResults();
                this._gamePhase = "roundOver";
            }
            this._turnCounter++;
        }
    };
    Table.prototype.onFirstPlayer = function () {
        if (this._turnCounter % this._players.length === 0)
            return true;
        else
            return false;
    };
    Table.prototype.onLastPlayer = function () {
        if (this._turnCounter % this._players.length === this._players.length - 1)
            return true;
        else
            return false;
    };
    Table.prototype.allPlayerActionsResolved = function () {
        for (var i = 0; i < this._players.length; i++) {
            var currentPlayer = this._players[i];
            if (currentPlayer.get_gameStatus === "betting" || currentPlayer.get_gameStatus === "bet" || currentPlayer.get_gameStatus === "hit") {
                return false;
            }
        }
        return true;
    };
    return Table;
}());
exports.Table = Table;
