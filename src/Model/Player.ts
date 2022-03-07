import { Card } from "./Card";
import { GameDecision } from "./GameDecision";

export class Player{
    private _name: string;
    private _type: string;
    private _gameType: string;
    private _hand: Card[];
    private _chips: number;
    private _bet: number;
    private _winAmount: number;
    private _gameStatus: string;

    constructor(_name: string, _type: string, _gameType: string, _chips: number = 400){
        this._name = _name;
        this._type = _type;
        this._gameType = _gameType;
        this._chips = _chips;
        this._hand = [];
        this._bet = 0;
        this._winAmount = 0;
        this._gameStatus = this.type === "house" ? "WaitingForBets" : "betting";
    }

    
    public get get_name() : string {
      return this._name
    }

    
    public get get_chips() : number {
      return this._chips;
    }
    
    

    
    public get get_bet() : number {
      return this._bet;
    }

    
    public get get_winAmount() : number {
      return this._winAmount;
    }


    
    public get get_gameStatus() : string {
      return this._gameStatus;
    }
    
    
    public get type() : string {
      return this._type;
    }
    
    
    
 
    public set set_bet(amount : number) {
      this._bet = amount;
    }

    
    public set set_winAmount(amount : number) {
      this._winAmount = amount;
    }
    
    
    public set set_gameStatus(status : string) {
      this._gameStatus = status;
    }
    
    

    public promptPlayer(userData: string | number | null): GameDecision{

      if(this._type === "ai" || this._type === "house" || userData === null)return this.get_aiDecision;
      if(this._gameStatus === "betting"){
        return new GameDecision("bet", userData as number);
      }
      else{
        return new GameDecision(userData as string, this._bet);
      }
    }
    

    public get get_aiDecision(): GameDecision{
      const betDenominations: number[] = [5, 20, 50, 100];
      let betDenominationCount: number = Player.getRandomInteger(1, 4);
      let betIndex: number = Player.getRandomInteger(0, 3);
      let bet: number = 0;

      if(this._gameStatus === "betting"){
        for(let i = betDenominationCount; i > 0;i--){
          bet += betDenominations[betIndex];
        }
        return new GameDecision("bet", bet);
      }
      else{
        if(this.get_handScore < 15){
          return new GameDecision("hit", this._bet);
        }
        else{
          return new GameDecision("stand", this._bet);
        }
      }
    }

    
    public get get_hand() : Card[] {
      return this._hand;
    }

    public set push_card(card : Card) { 
      this._hand.push(card);
    }

    
    public set reset_card(cards: Card[]){
      this._hand = cards;
    }
    
    
    

    public get get_handScore(): number{
      let count: number = 0;
      let aces: string[] = [];

      for(let i = 0;i < this._hand.length;i++){
        count += this._hand[i].get_rankNumber;
        if(this._hand[i].rank === "A")aces.push("A");
      }

      while(count > 21 && aces.length > 0){
        aces.pop();
        count -= 10;
      }
      return count;
    }

    private static getRandomInteger(min: number, max: number): number{
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

}

