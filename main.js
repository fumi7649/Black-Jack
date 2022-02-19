// 前回作成したコードをここに貼り付けてください。

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
            if(this.type === "ai" || this.type === "house")return this.getAiDecision();
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
            const betDenominations = [5,20,50,100];
            let betDenominationsCount = this.getIntegerRandom(1, 4);
            let betIndex =  this.getIntegerRandom(0, 3);
            let bet = 0; 

            for(let i = betDenominationsCount;i  > 0;i--){
                bet += betDenominations[betIndex];
            }
            return new GameDecision("bet", bet);
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


class Table
{
    /*
       String gameType : {"blackjack"}から選択。
       Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
       return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
    */
    constructor(gameType, betDenominations = [5,20,50,100])
    {
        // ゲームタイプを表します。
        this.gameType = gameType;
        
        // プレイヤーが選択できるベットの単位。
        this.betDenominations = betDenominations;
        
        // テーブルのカードのデッキ
        this.deck = new Deck(this.gameType);
        
        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
        this.players = []
        
        // プレイヤーをここで初期化してください。
        
        this.house = new Player('house', 'house', this.gameType);
        this.gamePhase = 'betting'

        // これは各ラウンドの結果をログに記録するための文字列の配列です。
        this.resultsLog = []

        this.turnCounter = 0;

    }
    /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
    evaluateMove(Player, userData)
    {
        //TODO: ここから挙動をコードしてください。
        let gameDecision = Player.promptPlayer(userData);

        
        if(gameDecision.action === "bet"){
            Player.bet = gameDecision.amount;
            Player.winAmount = gameDecision.amount;
            Player.gameStatus = "bet";
        }
        if(gameDecision.action === "stand"){
            if(Player.hand.length === 2 && Player.getHandScore() == 21)Player.gameStatus = "blackjack";
            Player.gameStatus = "stand";
        }
        if(gameDecision.action === "hit"){
            Player.gameStatus = "hit";
            Player.hand.push(this.deck.drawOne());
            if(Player.getHandScore() > 21){
                Player.gameStatus = "bust";
            }
        }
        if(gameDecision.action === "double"){
            Player.bet *= 2;
            Player.winAmount *= 2;
            Player.hand.push(this.deck.drawOne());
            if(Player.getHandScore() > 21)this.gameStatus = "bust";
        }
        if(gameDecision.action === "surrender"){
            Player.bet = Math.floor(Player.bet/2);
            Player.winAmount = Math.floor(Player/2);
            Player.gameStatus = "surrender";
        }
        
    }

    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults()
    {
        //TODO: ここから挙動をコードしてください。

        let s = "";

        for(let i = 0;i < this.players.length;i++){
            let currentPlayer = this.players[i];
            if(currentPlayer.gameStatus === "bust" || currentPlayer.gameStatus === "surrender" || currentPlayer.gameStatus === "broken"){
                s += `|name: ${currentPlayer.name}, action: ${currentPlayer.gameStatus}, bet: ${currentPlayer.bet}, won: -${currentPlayer.winAmount}|`;
            }
            if(this.house.gameStatus === "blackjack" && currentPlayer.gameStatus === "blackjack"){
                 s += `|name: ${currentPlayer.name}, action: ${currentPlayer.gameStatus}, bet: ${currentPlayer.bet}, won: 0|`;
            }
            if(currentPlayer.gameStatus === "blackjack"){
                s += `|name: ${currentPlayer.name}, action: ${currentPlayer.gameStatus}, bet: ${currentPlayer.bet}, won: ${currentPlayer.winAmount * 1.5}|`;
            }
            else{
                if(this.house.getHandScore() < currentPlayer.getHandScore()){
                    s += `|name: ${currentPlayer.name}, action: ${currentPlayer.gameStatus}, bet: ${currentPlayer.bet}, won: ${currentPlayer.winAmount}|`;
                }
                else{
                    s += `|name: ${currentPlayer.name}, action: ${currentPlayer.gameStatus}, bet: ${currentPlayer.bet}, won: -${currentPlayer.winAmount}|`;
                }
            }
        }

        this.resultsLog.push(s);
    }

    /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
    blackjackAssignPlayerHands()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0; i < 2;i++){
            this.house.hand.push(this.deck.drawOne());
        }
        console.log("house is" + this.house.hand[0].getRankNumber());

        for(let i = 0;i < this.players.length;i++){
            let j = 2;
            while(j > 0){
                this.players[i].hand.push(this.deck.drawOne());
                console.log(`player${i + 1}: ${this.players[i].hand[this.players[i].hand.length - 1].getRankNumber()}`);
                j--;
            }
        }
        
    }

    /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0;i < this.players.length;i++){
            while(this.players[i].hand.length > 0)this.players[i].hand.pop();
            this.players[i].bet = 0;
        }
        while(this.house.hand.length > 0)this.house.hand.pop();
    }
    
    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        let index = this.turnCounter % this.players.length;
        return this.players[index];
    }

    /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData)
    {
        //TODO: ここから挙動をコードしてください。
        let currentPlayer = this.getTurnPlayer();
        if(this.gamePhase === "betting"){
            if(this.onFirstPlayer()){
                this.blackjackClearPlayerHandsAndBets();
            }
            this.evaluateMove(currentPlayer, userData);
            if(this.onLastPlayer())this.gamePhase = "acting";
            this.turnCounter ++;
        }
        if(this.gamePhase === "acting"){
            if(this.onFirstPlayer())this.blackjackAssignPlayerHands();
            this.evaluateMove(currentPlayer, userData);
            if(this.onFirstPlayer() && this.allPlayerActionsResolved()){
                this.blackjackEvaluateAndGetRoundResults();
                this.gamePhase = "roundOver";
            }
            this.turnCounter++;
        }
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onFirstPlayer()
    {
        //TODO: ここから挙動をコードしてください。
        if(this.turnCounter % this.players.length === 0)return true;
        else return false;
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onLastPlayer()
    {
        //TODO: ここから挙動をコードしてください。

        if(this.turnCounter % this.players.length === this.players.length - 1)return true;
        else return false;
    }
    
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved()
    {
        //TODO: ここから挙動をコードしてください。
        for(let i = 0; i < this.players.length;i++){
            let current = this.players[i];
            if(current.gameStatus === "betting" || current.gameStatus === "bet" || current.gameStatus === "hit"){
                return false;
            }
        }
        return true;
    }
}





let table1 = new Table("blackjack");

let player1 = new Player("player1", "ai", "blackjack");
let player2 = new Player("player2", "ai", "blackjack");
let player3 = new Player("player3", "ai", "blackjack");
let player4 = new Player("player4", "ai", "blackjack");

table1.players.push(player1);
table1.players.push(player2);
table1.players.push(player3);
table1.players.push(player4);





while(table1.gamePhase != 'roundOver'){
    table1.haveTurn();
}

console.log(table1.resultsLog);