import { Card } from "./Card";

export class Deck {
  private gameType: string;
  private cards: Card[] = [];
  static readonly suits = ["H", "D", "C", "S"];
  static readonly ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  

  constructor(gameType: string){
    this.gameType = gameType;
    
    this.cards = gameType === "blackjack" ? Deck.initialBlackJack() : [];
  }

  private static initialBlackJack(): Card[]{
    let cards = [];
    for(let suit in Deck.suits){
        for(let rank in Deck.ranks){
          let card = new Card(suit, rank);
          cards.push(card);
        }
    }
    return cards;
  }

  public shuffle(): void{
    for(let i = 0;i < this.cards.length;i++){
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }

  public resetDeck(): void{
      if(this.gameType === "blackjack"){
        this.cards = Deck.initialBlackJack();
        this.shuffle();
      }
  }

  public drawOne(): Card{
    return this.cards.pop() as Card;
  }
}

let deck1 = new Deck("blackjack");
deck1.shuffle();
console.log(deck1.drawOne());