export class Card{

    private _suit: string;
    private _rank: string;

    constructor(_suit: string, _rank: string){
        this._suit = _suit;
        this._rank = _rank;
    }

    
    public get suit() : string {
      return this.suit;
    }
    
    public get rank() : string {
      return this._rank;
    }
    
    

    public get get_rankNumber(): number{
      if(this._rank === "A")return 11;
      else if(this._rank === "J" || this._rank === "Q" || this._rank === "K")return 10;
      else return parseInt(this._rank);
    }
}