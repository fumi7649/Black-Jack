import { Controller } from "../Controller/Controller";
import { Card } from "../Model/Card";
import { Player } from "../Model/Player";
import { Table } from "../Model/Table";

export class View {
    private static target = document.getElementById("target");


    public static displayNone(page: Element): void {
        page.classList.remove("d-block");
        page.classList.add("d-none");
    }

    public static displayBlock(page: Element): void {
        page.classList.remove("d-none");
        page.classList.add("d-block");
    }

    public static renderLandingPage(): void {
        if (View.target !== null) {
            View.target.innerHTML =
                `
            <div id="landingPage">
                <div class="bg-green vh-100 d-flex justify-content-center align-items-center flex-column">
                    <h6 class="text-white">Welcom to Card Game!</h6>
                    <div class="form-group">
                        <input type="text" placeholder="name" class="form-control" id="inputName">
                        <select class="form-select" id="selectGameType">
                            <option value="blackjack">Blackjack</option>
                            <option value="porker">Poker</option>
                        </select>
                                            
                            <button class="btn btn-success form-control my-2" id="startGame">Start New Game</button>
                            <button class="btn btn-outline-success form-control my-2" id="loginGame">Login</button>
                    </div>
                </div>
            </div>
            `
        }
    }

    public static renderTablePage(table: Table): void {
        if (View.target != null) {
            let botsString: string = ``;
            View.target.innerHTML = "";
            for (let i = 1; i < table.get_players.length; i++) {
                botsString += View.getPlayerString(table.get_players[i]);
            }
            View.target.innerHTML += View.getMenuBarString();
            View.target.innerHTML += View.getBlackJackRuluString();
            View.target.innerHTML += View.getResultLogString(table);

            View.target.innerHTML +=
                `
                <div class="col-12">
                <!-- house -->
                    <div id="house">
                        <div id="houseHands" class="d-flex justify-content-center">
                         ${View.getPlayerString(table.get_house)}
                        </div>
                    </div><!-- houseEnd -->
                    <div id="botsDiv" class="d-flex justify-content-around">
                        ${botsString}
                    </div>
                </div> 
                <div id="userDiv" class="d-flex justify-content-center">
                    ${View.getPlayerString(table.get_players[0])}
                </div>
            
                `;
            if (table.turnPlayer.type === "user") {
                if (table.get_gamePhase === "betting") {
                    View.target.innerHTML += View.getBetString();
                    Controller.addBetsEvent(table);
                    Controller.addBetSubmitEvent(table);
                }
                else if (table.get_gamePhase === "acting") {
                    if (table.playerActionsResolved(table.turnPlayer)) {
                        table.haveTurn(null);
                        View.renderTablePage(table);
                    }
                    else {
                        View.target.innerHTML += View.getActionString();
                        Controller.addActionEvent(table);
                    }
                }
                else if (table.get_gamePhase === "evaluateWinners") {
                    table.haveTurn(null);
                    View.renderTablePage(table);
                }
                else if (table.get_gamePhase === "roundOver") {
                    table.increase_roundCounter = 1;
                    let roundResults = document.querySelectorAll("#roundResults")[0];
                    View.displayBlock(roundResults);
                    Controller.addCloseResultOrRuleEvent(table);
                }
                else if (table.get_gamePhase === "stopOrContinue") {
                    View.target.innerHTML += View.getNextGameButtonStirng(table);
                    Controller.addStopOrContinueGame(table);
                }
            }
            else {
                setTimeout(function () {
                    table.haveTurn(null);
                    View.renderTablePage(table);
                }, 1000);
            }
            Controller.addRuluAndLogCheckEvent();
            Controller.addCloseResultOrRuleEvent(table);
        }
    }

    public static getCardString(card: Card): string {
        let cardString: string = ``;
        if (card === undefined) {
            cardString +=
                `
                <div class="bg-white p-1 mx-1">
                      <div class="text-center">
                          <img src="./assets/img/questionMark.png" alt="" width="45" height="45">
                      </div>
                      <div class="text-center">
                          <p class="m-0">?</p>
                      </div>
                  </div>
            `
        } else {
            cardString +=
                `
                    <div class="bg-white p-1 mx-1">
                          <div class="text-center">
                              <img src="./assets/img/${card.suit}.png" alt="" width="45" height="45">
                          </div>
                          <div class="text-center">
                              <p class="m-0">${card.rank}</p>
                          </div>
                      </div>
                `
        }

        return cardString;
    }

    public static getMenuBarString(): string {
        let menuBar: string =
            `
                <nav class="navbar navbar-expand-md navbar-light bg-green p-0">
                    <div class="containuer-fluid">
                        <button class="navbar-toggler ms-1" type="button" data-bs-toggle="collapse" data-bs-target="#menuBar" aria-controls="menuBar" aria-expanded="false">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div class="collapse navbar-collapse" id="menuBar">
                        <ul class="navbar-nav me-auto ms-2">
                            <li class="nav-item">
                                <a class="nav-link text-white" id="ruleButton">Rule</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-white" id="gameLogButton">GameLog</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                `;

        return menuBar;
    }

    public static getPlayerString(player: Player): string {
        let playerStatus: string = ``;
        let playerHands: string = ``;
        let len: number = 0;

        if (player.type === "house" && (player.get_gameStatus === "WaitingForBets" || player.get_gameStatus === "WaitingForActions")) {
            playerHands += View.getCardString(player.get_hand[0]);
            playerStatus +=
                `
            <div class="playerStatus">
                  <div class="">
                      <h6 class="text-center text-white">${player.get_name}</h6>
                  </div>
                  <div id="player1Infomation" class="d-flex justify-content-around text-white ">
                      <p>S: ${player.get_gameStatus}</p>
                  </div>
                  <div class="d-flex justify-content-center playerHands">
                        ${playerHands}
                  </div> 
            </div>
            `;
        } else if (player.type === "house") {
            if (player.get_hand.length > 0) {
                len = player.get_hand.length;
            }
            else {
                len = 2
            }
            for (let i = 0; i < len; i++) {
                playerHands += View.getCardString(player.get_hand[i]);
            }
            playerStatus +=
                `
            <div class="playerStatus">
                  <div class="">
                      <h6 class="text-center text-white pt-2">${player.get_name}</h6>
                  </div>
                  <div id="player1Infomation" class="d-flex justify-content-around text-white ">
                      <p>S: ${player.get_gameStatus}</p>
                  </div>
                  <div class="d-flex justify-content-center playerHands">
                        ${playerHands}
                  </div> 
            </div>
            `;
        }
        else {
            if (player.get_hand.length > 0) {
                len = player.get_hand.length;
            }
            else {
                len = 2
            }
            for (let i = 0; i < len; i++) {
                playerHands += View.getCardString(player.get_hand[i]);
            }
            playerStatus +=
                `
            <div class="playerStatus">
                  <div class="">
                      <h6 class="text-center text-white">${player.get_name}</h6>
                  </div>
                  <div id="player1Infomation" class="d-flex justify-content-around text-white ">
                      <p>S: ${player.get_gameStatus}</p>
                      <p>B: ${player.get_bet}</p>
                      <p>C: ${player.get_chips}</p>
                  </div>
                  <div class="d-flex justify-content-center playerHands">
                        ${playerHands}
                  </div> 
            </div>
            `;
        }

        return playerStatus;
    }

    public static getBetString(): string {
        let bet: string = ``;

        bet +=
            `
            <div id="betDivs" class="d-flex justify-content-around my-2 w-75 m-auto">
                <div>
                    <p class="text-white text-center">5</p>
                    <div class="input-group">
                        <button class="btn btn-danger decreaseBets">-</button>
                        <input type="text" value="0" class="input-number text-center inputBets" size="2">
                        <button class="btn btn-success increaseBets">+</button>
                    </div>
                </div>
                <div>
                    <p class="text-white text-center">20</p>
                    <div class="input-group">
                        <button class="btn btn-danger decreaseBets">-</button>
                        <input type="text" value="0" class="input-number text-center inputBets" size="2">
                        <button class="btn btn-success increaseBets">+</button>
                    </div>
                </div>
                <div>
                <p class="text-white text-center">50</p>
                    <div class="input-group">
                        <button class="btn btn-danger decreaseBets">-</button>
                        <input type="text" value="0" class="input-number text-center inputBets" size="2">
                        <button class="btn btn-success increaseBets">+</button>
                    </div>
                </div>
               <div>
                    <p class="text-white text-center">100</p>
                    <div class="input-group">
                        <button class="btn btn-danger decreaseBets">-</button>
                        <input type="text" value="0" class="input-number text-center inputBets" size="2">
                        <button class="btn btn-success increaseBets">+</button>
                    </div>
                </div>
                <div>
                    <div class="d-flex justify-content-center mt-4">
                        <button id="submitBetsButton" class="btn btn-success">Submit your bet</button>
                    </div>
                </div>
            </div>
            
            `

        return bet;
    }

    public static getActionString(): string {
        let actionString: string = ``;

        actionString +=
            `
            <div id="playerAction">
                <div class="d-flex justify-content-center p-2">
                    <button class="col-2 col-lg-1 btn btn-light mx-1 actionButton" value ="surrender">Surrender</button>
                    <button class="col-2 col-lg-1 btn btn-success mx-1 actionButton" value="stand">Stand</button>
                    <button class="col-2 col-lg-1 btn btn-warning mx-1 actionButton" value="hit">Hit</button>
                    <button id="double" class="col-2 col-lg-1 btn btn-danger mx-1 actionButton " value="double">Double</button>
                </div>
            </div>
            `
        return actionString;
    }

    public static getResultLogString(table: Table): string {
        let resultList: string = "";
        if (table.get_resultLog.length === 0) {
            resultList = "No result";
        } else {
            for (let i = 0; i < table.get_resultLog.length; i++) {
                resultList +=
                    `
                    <li class="list-group-item">
                        <h5>Round ${i + 1}</h5>
                        <p>${table.get_resultLog[i]}</p>
                    </li>
                    `
            }
        }
        let result: string =
            `
                <div id="roundResults" class="position-absolute top-50 start-50 translate-middle w-50 d-none">
                    <div class="card text-center max-">
                        <div class="card-header">Log</div>
                        <div class="card-body">
                            <div class="overflow-auto" style="max-height: 150px;">
                                <ul class="list-group list-group-flush">
                                    ${resultList}
                                </ul>                        
                            </div>
                            <a id="closeResults" class="card-link">close</a>
                        </div>
                    </div>
                </div>
            `;

        return result;
    }

    public static getBlackJackRuluString(): string {
        let gameRuluString: string = "";

        gameRuluString =
            `
            <div id="gameRule" class="d-flex m-3 pe-3  col-11 position-absolute top-0 start-0 bg-secondary d-none" style="z-index: 10;">
                <div class="col-2">
                    <div class="list-group" id="list-tab" role="tablist">
                        <a class="list-group-item list-group-item-action active" id="list-overview-list"
                            data-bs-toggle="list" href="#list-overview" role="tab" aria-controls="list-overview">ゲームの概要</a>
                        <a class="list-group-item list-group-item-action" id="list-flow-list" data-bs-toggle="list"
                            href="#list-flow" role="tab" aria-controls="list-flow">ゲームの流れ</a>
                        <a class="list-group-item list-group-item-action" id="list-nubmerCount-list" data-bs-toggle="list"
                            href="#list-nubmerCount" role="tab" aria-controls="list-nubmerCount">数の数え方</a>
                    </div>
                </div>
                <div class="col-6">
                    <div class="tab-content text-white f-90" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="list-overview" role="tabpanel"
                            aria-labelledby="list-overview-list">
                            <p class="p-2">
                                Houseと一対一で勝負します。自分の持っているカードとHouseの持っているカードの合計値を比べて合計値の大きいほうが勝利となります。しかし、合計値が21を超えてはいけません。21を超えた時点でbust(負け)となってしまいます。
                            </p>
                        </div>
                        <div class="tab-pane fade" id="list-flow" role="tabpanel" aria-labelledby="list-flow-list">
                            <div class="p-2">
                                <ol>
                                    <li>
                                        <h6>ベット</h6>
                                        <p>ゲームが始まる前に1ゲームで賭ける金額を決めます。</p>
                                    </li>
                                    <li>
                                        <h6>アクション</h6>
                                        <p>各プレイヤーは与えられた手札でさまざまなアクションをとることができます。</p>
                                        <ul>
                                            <li class="text-info">Surrender</li>
                                            <p class="py-1">最初に配られたカードを見て、その時点で自ら負けを認めること。サレンダーした場合かけた金額の半分がもどってきます。</p>
                                            <li class="text-info">Stand</li>
                                            <p class="py-1">今持っているカードで勝負することを宣言します。</p>
                                            <li class="text-info">Hit</li>
                                            <p class="py-1">現在の手札にさらに一枚追加します。手札の合計値が21をしまった時点でそのプレイヤーはbust(負け)となります。</p>
                                            <li class="text-info">Double</li>
                                            <p class="py-1">
                                                ベットを2倍にして、もう一枚カードを追加します。手札の合計値が21をしまった時点でそのプレイヤーはbust(負け)となります。このアクションは最初にカードが配られた後にしか行うことができません。
                                            </p>
                                        </ul>
                                    </li>
                                    <li>
                                        <h6>評価</h6>
                                        <p>すべてのプレイヤーがアクションを行えなくなった時点で、残ったプレイヤーとHouseの手札を比較し勝ち負けを判定します。評価に沿ってプレイヤーのチップを変動します。</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="list-nubmerCount" role="tabpanel"
                            aria-labelledby="list-nubmerCount-list">
                            
                                <ul>
                                    <li class="text-info">A</li>
                                    <p class="py-1">Aは1または,11としてカウントします。プレイヤーの都合のいいほうで数えることができます。</p>
                                    <li class="text-info">J, Q, K</li>
                                    <p class="py-1">J,Q,Kはすべて10としてカウントします。</p>
                                    <li class="text-info">それ以外(2～10)</li>
                                    <p class="py-1">それ以外のカードはそのままの値でカウントします。</p>
                                    <li class="text-info">A+10(J, Q, Kを含む)の組み合わせ場合</li>
                                    <p>プレイヤーの手札が2枚でA+10(J, Q, Kを含む)だったときをblackjackと呼びます。これはほかのblackjack以外の手札を打ち負かすことができます。例えば(2,
                                        9, K)のようにカードの合計値が同じであった場合でも勝利することができます。</p>
                                </ul>
                            <div>
                                    <p>例.1</p>
                                    <div class="d-flex">
                                        <div class="bg-white col-1  m-1">
                                            <div class="text-center">
                                                <img src="./assets/img/heart.png" alt="" width="45" height="45">
                                            </div>
                                            <div class="text-center">
                                                <p class="m-0 text-dark">A</p>
                                            </div>
                                        </div>
                                        <div class="bg-white col-1 m-1">
                                            <div class="text-center">
                                                <img src="./assets/img/diamond.png" alt="" width="45" height="45">
                                            </div>
                                            <div class="text-center">
                                                <p class="m-0 text-dark">8</p>
                                            </div>
                                        </div>
                                    </div>
                                <p>11 + 8 = 19</p>
                                <p>例.2</p>
                                <div class="d-flex">
                                    <div class="bg-white col-1  m-1">
                                        <div class="text-center">
                                            <img src="./assets/img/spade.png" alt="" width="45" height="45">
                                        </div>
                                        <div class="text-center">
                                            <p class="m-0 text-dark">A</p>
                                        </div>
                                    </div>
                                    <div class="bg-white col-1 m-1">
                                        <div class="text-center">
                                            <img src="./assets/img/clover.png" alt="" width="45" height="45">
                                        </div>
                                        <div class="text-center">
                                            <p class="m-0 text-dark">K</p>
                                        </div>
                                    </div>
                                </div>
                                <p>blackjack</p>
                            </div>
                        </div>
                    </div>
                </div>
                <a id="closeRule" type="button" class="ms-auto text-danger text-center">close</a>
            </div>
    
    
                `;
        return gameRuluString;
    }

    public static getNextGameButtonStirng(table: Table): string {
        let nextButton: string = "";
        if (table.get_players[0].get_gameStatus === "broke") {
            nextButton =
                `
                <div class="position-absolute top-50 start-50 translate-middle-x w-50">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title text-center">Game Over</h5>
                            <div class="p-2">
                                <button id="stopGame" class="btn btn-danger mx-3">Stop Game</button>
                                <button id="nextGameButton" class="btn btn-success mx-3">New Game</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
        } else {
            nextButton =
                `
                <div class="position-absolute top-50 start-50 translate-middle-x w-50">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">Are you continue?</h5>
                            <div class="d-flex justify-content-around p-2">
                                <button id="stopGameButton" class="btn btn-danger">Stop Game</button>
                                <button id="continueGameButton" class="btn btn-primary">Continue Game</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
        }

        return nextButton;
    }
}