import { Controller } from "../Controller/Controller";
import { Card } from "../Model/Card";
import { Player } from "../Model/Player";
import { Table } from "../Model/Table";

export class View {
    private static target = document.getElementById("target");

    constructor() {

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
                        <button class="btn btn-success form-control my-2" id="startGame">Start Game</button>
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

            View.target.innerHTML =
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
                    if (table.playerActionsResolved(table.turnPlayer)){
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
                    View.target.innerHTML += View.getResultLogString(table);
                    Controller.addOKEvent(table);
                }
            }
            else {
                setTimeout(function () {
                    table.haveTurn(null);
                    View.renderTablePage(table);
                }, 1000);
            }
        }
    }

    public static getCardString(card: Card): string {
        let cardString: string = ``;
        if (card === undefined) {
            cardString +=
                `
            <div class="bg-white p-1 mx-2">
                      <div class="text-center">
                          <img src="./assets/img/questionMark.png" alt="" width="50" height="50">
                      </div>
                      <div class="text-center">
                          <p class="m-0">?</p>
                      </div>
                  </div>
            `
        } else {
            cardString +=
                `
                <div class="bg-white p-2 mx-2">
                          <div class="text-center">
                              <img src="./assets/img/${card.suit}.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">${card.rank}</p>
                          </div>
                      </div>
                `
        }

        return cardString;
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
            <div id="betDivs" class="d-flex justify-content-around w-50 my-2 m-auto">
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
            </div>
            <div class="d-flex justify-content-center p-1">
                <button id="submitBetsButton" class="btn btn-success">Submit your bet</button>
            </div>
            `

        return bet;
    }

    public static getActionString(): string {
        let actionString: string = ``;

        actionString +=
            `
            <div id="playerAction">
                <div class="d-flex justify-content-center p-2 py-5">
                    <button class="col-2 col-lg-1 btn btn-light mx-1 actionButton" value ="surrender">Surrender</button>
                    <button class="col-2 col-lg-1 btn btn-success mx-1 actionButton" value="stand">Stand</button>
                    <button class="col-2 col-lg-1 btn btn-warning mx-1 actionButton" value="hit">Hit</button>
                    <button class="col-2 col-lg-1 btn btn-danger mx-1 actionButton" value="double">Double</button>
                </div>
            </div>
            `
        return actionString;
    }

    public static getResultLogString(table: Table): string {
        let resultList: string = "";
        for (let i = 0;i < table.get_resultLog.length; i++) {
            resultList +=
                `
                <li class="list-group-item">
                    ${table.get_resultLog[i]}
                </li>
                `
        }

        let result: string =
            `
            <div id="roundResults" class="position-absolute top-50 start-50 translate-middle-x w-50">
                <div class="card text-center max-">
                    <div class="card-header">
                    round ${table.get_roundCounter + 1}
                    </div>
                    <div class="card-body">
                        <div class="overflow-auto" style="max-height: 150px;">
                            <ul class="list-group list-group-flush">
                                ${resultList}
                            </ul>                        
                        </div>
                        <a id="okResults" class="card-link">OK</a>
                    </div>
                </div>
            </div>
        `;

        table.increase_roundCounter = 1;
        return result;
    }

    public static getNextGameButtonStirng(table: Table): string {
        let nextButton: string = "";
        if (table.get_players[0].get_gameStatus === "broke") {
            nextButton =
                `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title text-center">Game Over</h5>
                            <div class="p-2">
                                <button id="stopGame" class="btn btn-danger">Stop Game</button>
                                <button id="nextGameButton" class="btn btn-success">New Game</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
        }else{
            nextButton =
                `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Do you want to continue the game?</h5>
                            <div class="d-flex justify-content-around p-2">
                                <button id="stopGame" class="btn btn-danger">Stop Game</button>
                                <button id="nextGameButton" class="btn btn-primary">Next Game</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
        }

        return nextButton;
    }
}