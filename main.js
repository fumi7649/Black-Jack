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
        this.cards = this.gameType === "blackjack" ? Deck.initialCreateDeck() : [];

        // ゲームタイプによって、カードを初期化してください。

    }
    
    static initialCreateDeck(){
        const suits = ["H", "S", "D" ,"C"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        let cards = [];

        for(let i = 0;i < suits.length;i++){
            for(let j = 0;j < ranks.length;j++){
                let card = new Card(suits[i], ranks[j]);
                cards.push(card);
            }
        }
        
        return cards;
    }

    /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
    shuffle()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0;i < this.cards.length;i++){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
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


class Player
{
    /*
        String name : プレイヤーの名前
        String type : プレイヤータイプ。{'ai', 'user', 'house'}から選択。
        String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
        ?Number chips : ゲーム開始に必要なチップ。デフォルトは400。
    */
    constructor(name, type, gameType, chips = 400)
    {
        // プレイヤーの名前
        this.name = name;

        // プレイヤーのタイプ
        this.type = type;

        // 現在のゲームタイプ
        this.gameType = gameType;

        // プレイヤーの手札
        this.hand = [];

        // プレイヤーが所持しているチップ。
        this.chips = chips;

        // 現在のラウンドでのベットしているチップ
        this.bet = 0

        // 勝利金額。正の数にも負の数にもなります。
        this.winAmount = 0 

        // プレイヤーのゲームの状態やアクションを表します。
        // ブラックジャックの場合、最初の状態は「betting」です。
        this.gameStatus = 'betting' 

    }

    /*
       ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
       return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

        このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
    */
    promptPlayer(userData)
    {
        //TODO: ここから挙動をコードしてください。
        if(this.gameStatus === "betting"){
            if(this.type === "ai")return this.getAiDecision();
            else{
                return new GameDecision("bet", userData);
            }
        }
        else{
            if(this.type === "ai")return this.getAiDecision();
            else{
                return new GameDecision(userData, this.bet);
            }
        }
    }

    /*
       return Number : 手札の合計

       合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
    */
    getHandScore()
    {
        //TODO: ここから挙動をコードしてください。
        let count = 0;
        let aces = [];

        for(let i = 0;i < this.hand.length;i++){
            count += this.hand[i].getRankNumber();
            if(this.hand[i].rank === "A")aces.push("A");
        }

        while(count > 21 && aces.length > 0){
            aces.pop();
            count -= 10;    
        }
        return count;
    }

    getAiDecision(){
        if(this.gameStatus === "betting"){
            return new GameDecision("bet", this.getIntegerRandom(0, this.chips));
        }
        else{
            if(this.getHandScore() < 15){
                return new GameDecision("hit", this.bet);
            }
            else{
                return new GameDecision("stand", this.bet);
            }
        }
    }

    getIntegerRandom(min, max){
        return Math.floor(Math.random() * (max + 1 -min)) + min;
    }
}

class GameDecision
{
    /*
       String action : プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
       Number amount : プレイヤーが選択する数値。

       これはPlayer.promptPlayer()は常にreturnする、標準化されたフォーマットです。
    */
    constructor(action, amount)
    {
        // アクション
        this.action = action
        
        // プレイヤーが選択する数値
        this.amount = amount
    }
}
