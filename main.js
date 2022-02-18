// 前回作成したコードをここに貼り付けてください。
class Card
{
    /*
       String suit : {"H", "D", "C", "S"}から選択
       String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
    constructor(suit, rank)
    {
        // スート
        this.suit = suit

        // ランク
        this.rank = rank
    }

    /*
       return Number : カードのランクを基準とした整数のスコア。
       
        2-10はそのまま数値を返します。
    　  {"J", "Q", "K"}を含む、フェースカードは10を返します。
        "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
    */

    getRankNumber()
    {
        //TODO: ここから挙動をコードしてください。
        if(this.rank === "A")return 11;
        else if(this.rank === "J" || this.rank === "Q" || this.rank === "K")return 10;
        else return parseInt(this.rank);
    }
}

class Deck
{
    /*
       String gameType : ゲームタイプの指定。{'blackjack'}から選択。
    */
    constructor(gameType)
    {
        // このデッキが扱うゲームタイプ
        this.gameType = gameType

        // カードの配列
        this.cards = [];

        // ゲームタイプによって、カードを初期化してください。
        this.initialCreateDeck();

    }
    
     initialCreateDeck(){
        const suits = ["H", "S", "D" ,"C"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        let cards = [];
        if(this.gameType === "blackjack"){
            for(let i = 0;i < suits.length;i++){
                for(let j = 0;j < ranks.length;i++){
                    let card = new Card(suits[i], ranks[j]);
                    cards.push(card);
                }
            }  
            this.cards = cards;
        }
        
    }

    /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
    shuffle()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0;i < this.cards.length;i++){
            let j = Math.floor(Math.ramdom * (i + 1));
            let temp = this.card[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    /*
       String gameType : どのゲームにリセットするか
       return null : このメソッドは、デッキの状態を更新します。
    

    */
    resetDeck()
    {
        //TODO: ここから挙動をコードしてください。
        this.cards = Deck.initialCreateDeck();
        this.cards.shuffle();

    }
    
    /*
       return Card : ポップされたカードを返します。
       カード配列から先頭のカード要素をポップして返します。
    */
    drawOne()
    {
        //TODO: code behavior here
        return this.cards.pop();
    }
}


let deck = new Deck("blackjack");

deck.shuffle();

// console.log(deck.drawOne().getRankNumber());
// console.log(deck.drawOne().getRankNumber());
// console.log(deck.drawOne().getRankNumber());
// console.log(deck.drawOne().getRankNumber());
// console.log(deck.drawOne().getRankNumber());