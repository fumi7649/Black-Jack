export class Card{

    readonly suit: string;
    readonly rank: string;

    constructor(suit: string, rank: string){
        this.suit = suit;
        this.rank = rank;
    }

    public get rankNumber(): number{
      if(this.rank === "A")return 11;
      else if(this.rank === "J" || this.rank === "Q" || this.rank === "K")return 10;
      else return parseInt(this.rank);
    }
}