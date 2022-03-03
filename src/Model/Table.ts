import { Player } from "./Player";
import { Deck } from "./Deck";
import { GameDecision } from "./GameDecision";
import { Card } from "./Card";

export class Table{
  private _gameType: string;
  private _betDenomination: number[];
  private _deck: Deck;
  private _players: Player[] = [];
  private _house: Player;
  private _gamePhase = 'betting';
  private _resultLog: string[];
  private _turnCounter: number;


  constructor(_gameType: string, _betDenomination: number[] = [5, 20, 50, 100]){
    this._gameType = _gameType;
    this._betDenomination = _betDenomination;
    this._deck = new Deck(this._gameType);
    this._house = new Player('house', 'house', this._gameType);
    this._resultLog = [];
    this._turnCounter = 0;
  }

  
  public get get_house() : Player {
    return this._house;
  }

  
  public get get_players() : Player[] {
    return this._players;
  }
  
  
  
  public set set_gamePhase(gamePhase : string) {
    this._gamePhase = gamePhase;
  }

  
  public set set_player(player: Player) {
    this._players.push(player);
  }

  
  public get get_gamePhase() : string {
    return this._gamePhase;
  }

  
  public get get_resultLog() : string[] {
    return this._resultLog;
  }
  
  
  
  

  public evaluateMove(player: Player, userData: any): void{
    let gameDecision: GameDecision = player.promptPlayer(userData);

    if(gameDecision.get_action === "bet"){
        player.set_bet = gameDecision.get_amount;
        player.set_winAmount = gameDecision.get_amount;
        player.set_gameStatus = "bet";
    }
    if(gameDecision.get_action === "stand"){
      if(player.get_hand.length === 2 && player.get_handScore === 21)player.set_gameStatus = "blackjack";
      else{
        player.set_gameStatus = "stand";
      }
    }
    if(gameDecision.get_action === "hit"){
      player.set_gameStatus = "hit";
      player.push_card = this._deck.drawOne();
      if(player.get_handScore > 21)player.set_gameStatus = "bust";
    }
    if(gameDecision.get_action === "surrender"){
      player.set_bet = Math.floor(player.get_bet / 2);
      player.set_winAmount = Math.floor(player.get_winAmount / 2);
      player.set_gameStatus = "surrender";
    }
  }

    public blackjackEvaluateAndGetRoundResults(): void{
      let s: string = "";

      for(let i = 0; i < this._players.length;i++){
        let currentPlayer: Player = this._players[i];
        if(currentPlayer.get_gameStatus === "bust" || currentPlayer.get_gameStatus === "surrender" || currentPlayer.get_gameStatus === "broken"){
          s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|`;
        }
        if(this._house.get_gameStatus === "blackjack" && currentPlayer.get_gameStatus === "blackjack"){
          s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|`;
        }
        if(currentPlayer.get_gameStatus === "blackjack"){
          s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount * 1.5}|`;
        }
        else{
          if(this._house.get_handScore < currentPlayer.get_handScore){
            s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: ${currentPlayer.get_winAmount}|`;
          }
          else{
            s += `|name: ${currentPlayer.get_name}, action: ${currentPlayer.get_gameStatus}, bet: ${currentPlayer.get_bet}, won: -${currentPlayer.get_winAmount}|`;
          }
        }
      }
      this._resultLog.push(s);
    }

    public blackjackAssignPlayerHands(): void{
      for(let i = 0;i < 2;i++){
        this._house.push_card = this._deck.drawOne();
      }

      for(let i = 0;i < this._players.length;i++){
        let j = 2;
        let currentPlayer: Player = this._players[i];
        while(j > 0){
          currentPlayer.push_card = this._deck.drawOne();
        }
      }
    }

    public blackjackClearPlayerHandsAndBets(): void{
      for(let i = 0;i < this._players.length;i ++){
        let currentPlayer: Player = this._players[i];
        if(currentPlayer.get_hand.length > 0)currentPlayer.reset_card = [];
      }
      if(this._house.get_hand.length > 0)this._house.reset_card = [];
    }

    
    public get turnPlayer() : Player {
      let index: number = this._turnCounter % this._players.length;
      return this._players[index] as Player;
    }
    
    /**
     * haveTurn
userData: any     */
    public haveTurn(userData: any) {
      let currentPlayer: Player = this.turnPlayer;
      if(this._gamePhase === "betting"){
        if(this.onFirstPlayer()){
          this.blackjackClearPlayerHandsAndBets();
        }
        this.evaluateMove(currentPlayer, userData);
        if(this.onLastPlayer())this.set_gamePhase = "acting";
      }
      if(this._gamePhase === "acting"){
        if(this.onFirstPlayer())this.blackjackAssignPlayerHands();
        this.evaluateMove(currentPlayer, userData);
        if(this.onFirstPlayer() && this.allPlayerActionsResolved()){
          this.blackjackEvaluateAndGetRoundResults();
          this._gamePhase = "roundOver";
        }
        this._turnCounter++;
      }
    }

    public onFirstPlayer(): boolean{
      if(this._turnCounter % this._players.length === 0)return true;
      else return false;
    }

    public onLastPlayer(): boolean{
      if(this._turnCounter % this._players.length === this._players.length - 1)return true;
      else return false;
    }

    public allPlayerActionsResolved(): boolean{
      for(let i = 0;i < this._players.length;i++){
        let currentPlayer: Player = this._players[i];
        if(currentPlayer.get_gameStatus === "betting" || currentPlayer.get_gameStatus === "bet" || currentPlayer.get_gameStatus === "hit"){
          return false;
        }
      }
      return true;
    }

}



