import { Player } from "./Player";
import { Deck } from "./Deck";
import { GameDecision } from "./GameDecision";
import { Card } from "./Card";

export class Table {
  private _gameType: string;
  private _betDenomination: number[];
  private _deck: Deck;
  private _players: Player[] = [];
  private _house: Player;
  private _gamePhase = 'betting';
  private _resultLog: string[];
  private _turnCounter: number;
  private _roundConuter: number;


  constructor(_gameType: string, _betDenomination: number[] = [5, 20, 50, 100]) {
    this._gameType = _gameType;
    this._betDenomination = _betDenomination;
    this._deck = new Deck(this._gameType);
    this._house = new Player('house', 'house', this._gameType);
    this._resultLog = [];
    this._turnCounter = 0;
    this._roundConuter = 1;
  }


  public get get_house(): Player {
    return this._house;
  }


  public get get_players(): Player[] {
    return this._players;
  }

  
  public get get_roundCounter() : number {
    return this._roundConuter;
  }
  
  
  public get get_betDenomination() : number[] {
    return this._betDenomination;
  }
  



  
  public set increase_turnCounter(n : number) {
    this._turnCounter += n;
  }

  
  public set increase_roundCounter(n : number) {
    this._roundConuter += n;
  }
  
  

  public set set_gamePhase(gamePhase: string) {
    this._gamePhase = gamePhase;
  }


  public set set_player(player: Player) {
    this._players.push(player);
  }


  public get get_gamePhase(): string {
    return this._gamePhase;
  }


  public get get_resultLog(): string[] {
    return this._resultLog;
  }

  
 





  public evaluateMove(player: Player, userData: string | number | null): void {
    let gameDecision: GameDecision = player.promptPlayer(userData);

    if (gameDecision.get_action === "bet") {
      player.set_bet = gameDecision.get_amount;
      player.set_winAmount = gameDecision.get_amount;
      player.set_gameStatus = "bet";
    }
    if (gameDecision.get_action === "stand") {
      if (player.get_hand.length === 2 && player.get_handScore === 21) player.set_gameStatus = "blackjack";
      else {
        player.set_gameStatus = "stand";
      }
    }
    if (gameDecision.get_action === "hit") {
      player.set_gameStatus = "hit";
      player.push_card = this._deck.drawOne();
      if (player.get_handScore > 21) player.set_gameStatus = "bust";
    }
    if(gameDecision.get_action === "double"){
      player.set_bet = player.get_bet * 2;
      player.set_winAmount = player.get_winAmount * 2;
      player.push_card = this._deck.drawOne();
      if(player.get_handScore > 21)player.set_gameStatus = "bust";
    }
    if (gameDecision.get_action === "surrender") {
      player.set_bet = Math.floor(player.get_bet / 2);
      player.set_winAmount = Math.floor(player.get_winAmount / 2);
      player.set_gameStatus = "surrender";
    }
  }

  public blackjackEvaluateAndGetRoundResults(): void {
    let s: string = "";

    for (let i = 0; i < this._players.length; i++) {
      let currentPlayer: Player = this._players[i];
      if (currentPlayer.get_gameStatus === "bust" || currentPlayer.get_gameStatus === "surrender") {
        s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|\n`;
      }
      if (this._house.get_gameStatus === "blackjack" && currentPlayer.get_gameStatus === "blackjack") {
        s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|\n`;
      }
      if (currentPlayer.get_gameStatus === "blackjack") {
        s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount * 1.5}|\n`;
      }
      else {
        if (this._house.get_handScore < currentPlayer.get_handScore) {
          s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|\n`;
        }
        else {
          s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|\n`;
        }
      }
    }
    this._resultLog.push(s);
  }

  public blackjackAssignPlayerHands(): void {
    this._deck.shuffle();
    for (let i = 0; i < 2; i++) {
      this._house.push_card = this._deck.drawOne();
    }

    for (let i = 0; i < this._players.length; i++) {
      let j = 2;
      let currentPlayer: Player = this._players[i];
      while (j > 0) {
        currentPlayer.push_card = this._deck.drawOne();
        j--;
      }
    }
  }

  public blackjackClearPlayerHandsAndBets(): void {
    for (let i = 0; i < this._players.length; i++) {
      let currentPlayer: Player = this._players[i];
      if (currentPlayer.get_hand.length > 0) currentPlayer.reset_card = [];
    }
    if (this._house.get_hand.length > 0) this._house.reset_card = [];
  }


  public get turnPlayer(): Player {
    let index: number = this._turnCounter % this._players.length;
    return this._players[index] as Player;
  }

  public haveTurn(userData: string | number | null) {
    let currentPlayer: Player = this.turnPlayer;
    console.log("turnCount:" + this._turnCounter);
    console.log("turnPlayer:" + this.turnPlayer.get_name);
    console.log(this._gamePhase);

    if (this._gamePhase === "betting") {
      if(this.onFirstPlayer()){
        this.blackjackClearPlayerHandsAndBets();
      }
      this.evaluateMove(currentPlayer, userData);
      if(this.onLastPlayer()){
        this.set_gamePhase = "acting";
        this.increase_turnCounter = 1;
        return;
      }
    }
    if (this._gamePhase === "acting") {
      if(this.onFirstPlayer() && currentPlayer.get_gameStatus === "bet"){
        this._house.set_gameStatus = "WaitingForActions";
        this.blackjackAssignPlayerHands();
      }
      this.evaluateMove(currentPlayer, userData);
      if(this.onLastPlayer() && this.allPlayerActionsResolved())this.set_gamePhase = "evaluateWinners";
    }
    if(this._gamePhase === "evaluateWinners"){
      this.evaluateMove(this._house, null);
      if(this.playerActionsResolved(this._house))this.set_gamePhase = "roundOver";
    }
    if(this._gamePhase === "roundOver"){
      this.blackjackEvaluateAndGetRoundResults();
      if(this._players[0].get_chips < 0)this._players[0].set_gameStatus = "broke";
    }
    this.increase_turnCounter = 1;
  }

  public onFirstPlayer(): boolean {
    if (this._turnCounter % this._players.length === 0) return true;
    else return false;
  }

  public onLastPlayer(): boolean {
    if (this._turnCounter % this._players.length === this._players.length - 1) return true;
    else return false;
  }

  
  public playerActionsResolved(player: Player): boolean{
    if(player.type === "user" || player.type === "ai"){
      if (player.get_gameStatus === "betting" || player.get_gameStatus === "bet" || player.get_gameStatus === "hit") {
        return false;
      }
    }
    else{
      if(this._house.get_gameStatus === "WaitingForBets" || this._house.get_gameStatus === "WaitingForActions" || this._house.get_gameStatus === "betting" || this._house.get_gameStatus === "bet" || this._house.get_gameStatus === "hit"){
        return false;
      }
    }
    return true;
  }

  public allPlayerActionsResolved(): boolean {
    for (let i = 0; i < this._players.length; i++) {
      let currentPlayer: Player = this._players[i];
      if (currentPlayer.get_gameStatus === "betting" || currentPlayer.get_gameStatus === "bet" || currentPlayer.get_gameStatus === "hit") {
        return false;
      }
    }
    return true;
  }

}



