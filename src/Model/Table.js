"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const Player_1 = require("./Player");
const Deck_1 = require("./Deck");
class Table {
    constructor(_gameType, _betDenomination = [5, 20, 50, 100]) {
        this._players = [];
        this._gamePhase = 'betting';
        this._gameType = _gameType;
        this._betDenomination = _betDenomination;
        this._deck = new Deck_1.Deck(this._gameType);
        this._house = new Player_1.Player('house', 'house', this._gameType);
        this._resultLog = [];
        this._turnCounter = 0;
        this._roundConuter = 0;
    }
    get get_house() {
        return this._house;
    }
    get get_players() {
        return this._players;
    }
    get get_roundCounter() {
        return this._roundConuter;
    }
    get get_betDenomination() {
        return this._betDenomination;
    }
    set increase_turnCounter(n) {
        this._turnCounter += n;
    }
    set set_turnCounter(n) {
        this._turnCounter = n;
    }
    set increase_roundCounter(n) {
        this._roundConuter += n;
    }
    set set_gamePhase(gamePhase) {
        this._gamePhase = gamePhase;
    }
    set set_player(player) {
        this._players.push(player);
    }
    get get_gamePhase() {
        return this._gamePhase;
    }
    get get_resultLog() {
        return this._resultLog;
    }
    evaluateMove(player, userData) {
        if (player.get_gameStatus === "bust" || player.get_gameStatus === "surrender" || player.get_gameStatus === "stand" || player.get_gameStatus === "double")
            return;
        let gameDecision = player.promptPlayer(userData);
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
        if (gameDecision.get_action === "double") {
            player.set_bet = player.get_bet * 2;
            player.set_winAmount = player.get_winAmount * 2;
            player.push_card = this._deck.drawOne();
            player.set_gameStatus = "double";
            if (player.get_handScore > 21)
                player.set_gameStatus = "bust";
        }
        if (gameDecision.get_action === "surrender") {
            player.set_bet = Math.floor(player.get_bet / 2);
            player.set_winAmount = Math.floor(player.get_winAmount / 2);
            player.set_gameStatus = "surrender";
        }
    }
    blackjackEvaluateAndGetRoundResults() {
        let s = "";
        for (let i = 0; i < this._players.length; i++) {
            let currentPlayer = this._players[i];
            if (currentPlayer.get_gameStatus === "bust" || currentPlayer.get_gameStatus === "surrender") {
                s +=
                    `
          <div class="d-flex">
            <p class="text-danger">Lose</p>
            <p>|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|</p>
          </div>
        `;
                currentPlayer.set_chips = -currentPlayer.get_winAmount;
            }
            else if ((this._house.get_gameStatus === "blackjack" && currentPlayer.get_gameStatus === "blackjack") || (this._house.get_gameStatus === "bust" && (currentPlayer.get_gameStatus === "surrender" || currentPlayer.get_gameStatus === "bust"))) {
                s +=
                    `
        <div class="d-flex">
        <p>Draw</p> 
          <p >|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: 0|</p>
        </div>
        `;
            }
            else if (currentPlayer.get_gameStatus === "blackjack") {
                s +=
                    `
        <div class="d-flex">
          <p class="text-info">BlackJack</p>
          <p>
          |name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount * 1.5}|
          </p>
        </div>
        `;
                currentPlayer.set_chips = currentPlayer.get_winAmount * 1.5;
            }
            else if (this._house.get_gameStatus === "bust") {
                s +=
                    `
        <div class="d-flex">
          <p class="text-success">Win</p>
          <p>|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|</p>
        </div>
        `;
            }
            else {
                if (this._house.get_handScore < currentPlayer.get_handScore) {
                    s +=
                        `
          <div class="d-flex">
            <p class="text-success">Win</p>
            <p>|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|</p>
          </div>
          `;
                    currentPlayer.set_chips = currentPlayer.get_winAmount;
                }
                else if (this._house.get_handScore === currentPlayer.get_handScore) {
                    s +=
                        `
          <div class="d-flex">
          <p>Draw</p> 
            <p >|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: 0|</p>
          </div>
          `;
                }
                else {
                    s +=
                        `
           <div class="d-flex">
             <p class="text-danger">Lose</p>
             <p>|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|</p>
           </div>
         `;
                    currentPlayer.set_chips = -currentPlayer.get_winAmount;
                }
            }
        }
        this._resultLog.push(s);
    }
    blackjackAssignPlayerHands() {
        this._deck.shuffle();
        for (let i = 0; i < 2; i++) {
            this._house.push_card = this._deck.drawOne();
        }
        for (let i = 0; i < this._players.length; i++) {
            let j = 2;
            let currentPlayer = this._players[i];
            while (j > 0) {
                currentPlayer.push_card = this._deck.drawOne();
                j--;
            }
        }
    }
    blackjackClearPlayerHandsAndBets() {
        for (let i = 0; i < this._players.length; i++) {
            let currentPlayer = this._players[i];
            if (currentPlayer.get_hand.length > 0)
                currentPlayer.reset_card = [];
        }
        if (this._house.get_hand.length > 0)
            this._house.reset_card = [];
    }
    get turnPlayer() {
        let index = this._turnCounter % this._players.length;
        return this._players[index];
    }
    haveTurn(userData) {
        let currentPlayer = this.turnPlayer;
        if (this._gamePhase === "betting") {
            if (this.onFirstPlayer()) {
                this.blackjackClearPlayerHandsAndBets();
            }
            this.evaluateMove(currentPlayer, userData);
            if (this.onLastPlayer()) {
                this.set_gamePhase = "acting";
                this.increase_turnCounter = 1;
                this.blackjackAssignPlayerHands();
                this._house.set_gameStatus = "WaitingForActions";
                return;
            }
        }
        if (this._gamePhase === "acting") {
            this.evaluateMove(currentPlayer, userData);
            if (this.allPlayerActionsResolved())
                this.set_gamePhase = "evaluateWinners";
        }
        if (this._gamePhase === "evaluateWinners") {
            this.evaluateMove(this._house, null);
            if (this.playerActionsResolved(this._house))
                this.set_gamePhase = "roundOver";
        }
        if (this._gamePhase === "roundOver") {
            if (this.get_resultLog[this._roundConuter] === undefined) {
                this.blackjackEvaluateAndGetRoundResults();
            }
            if (this._players[0].get_chips <= 0)
                this._players[0].set_gameStatus = "broke";
        }
        this.increase_turnCounter = 1;
    }
    onFirstPlayer() {
        if (this._turnCounter % this._players.length === 0)
            return true;
        else
            return false;
    }
    onLastPlayer() {
        if (this._turnCounter % this._players.length === this._players.length - 1)
            return true;
        else
            return false;
    }
    playerActionsResolved(player) {
        if (player.type === "user" || player.type === "ai") {
            if (player.get_gameStatus === "betting" || player.get_gameStatus === "bet" || player.get_gameStatus === "hit") {
                return false;
            }
        }
        else {
            if (this._house.get_gameStatus === "WaitingForBets" || this._house.get_gameStatus === "WaitingForActions" || this._house.get_gameStatus === "betting" || this._house.get_gameStatus === "bet" || this._house.get_gameStatus === "hit") {
                return false;
            }
        }
        return true;
    }
    allPlayerActionsResolved() {
        for (let i = 0; i < this._players.length; i++) {
            let currentPlayer = this._players[i];
            if (currentPlayer.get_gameStatus === "betting" || currentPlayer.get_gameStatus === "bet" || currentPlayer.get_gameStatus === "hit") {
                return false;
            }
        }
        return true;
    }
    nextGame() {
        this.set_gamePhase = "betting";
        this.set_turnCounter = 0;
        this._deck = new Deck_1.Deck(this._gameType);
        this._deck.shuffle();
        this._house.set_gameStatus = "betting";
        for (let i = 0; i < this._players.length; i++) {
            this._players[i].set_gameStatus = "betting";
        }
    }
}
exports.Table = Table;
