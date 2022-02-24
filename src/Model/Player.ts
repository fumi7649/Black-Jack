import { Card } from "./Card";
export class Player{
    private name: string;
    private type: string;
    private gameType: string;
    private hand: Card[];
    private chips: number;
    private bet: number;
    private winAmount: number;
    private gameStatus: string;

    constructor(name: string, type: string, gameType: string, chips: number){
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = 400;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "betting";
    }


    public promptPlayer(userData: any): GameDecision{

      if(this.type === "ai" || this.type === "house")return this.aiDecision;
      if(this.gameStatus === "betting"){
        return new GameDecision("bet", userData);
      }
      else{
        return new GameDecision(userData, this.bet);
      }
    }
    

    public get aiDecision(): GameDecision{
      const betDenominations: number[] = [5, 20, 50, 100];
      let betDenominationCount: number = Player.getRandomInteger(1, 4);
      let betIndex: number = Player.getRandomInteger(0, 3);
      let bet: number = 0;

      if(this.gameStatus === "betting"){
        for(let i = betDenominationCount; i > 0;i--){
          bet += betDenominations[betIndex];
        }
        return new GameDecision("bet", bet);
      }
      else{
        if(this.handScore < 15){
          return new GameDecision("hit", this.bet);
        }
        else{
          return new GameDecision("stand", this.bet);
        }
      }
    }

    public get handScore(): number{
      let count: number = 0;
      let aces: string[] = [];

      for(let i = 0;i < this.hand.length;i++){
        count += this.hand[i].rankNumber;
        if(this.hand[i].rank === "A")aces.push("A");
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

class GameDecision{
  private action: string;
  private amount: number;

  constructor(action: string, amount: number){
    this.action = action;
    this.amount = amount;
  }
}