import { Card } from "../Model/Card";
import { Player } from "../Model/Player";
import { Table } from "../Model/Table";

export class View {
    private target = document.getElementById("target");

    constructor() {

    }

    public renderLandingPage(): void {
        if (this.target !== null) {
            this.target.innerHTML =
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

    public renderTablePage(table: Table): void {

        if (this.target != null) {
            let botsString: string = ``;
            this.target.innerHTML = "";
            for (let i = 1; i < table.get_players.length;i++) {
                botsString += this.getPlayerString(table.get_players[i]);
            }

            this.target.innerHTML =
                `
                <div class="col-12">
                <!-- house -->
                    <div id="house">
                        <div id="houseHands" class="d-flex justify-content-center">
                         ${this.getPlayerString(table.get_house)}
                        </div>
                    </div><!-- houseEnd -->
                    <div id="botsDiv" class="d-flex justify-content-around">
                        ${botsString}
                    </div>
                </div> 
                <div id="userDiv" class="d-flex justify-content-center">
                    ${this.getPlayerString(table.get_players[0])}
                </div>
            
                `;
            if(table.get_gamePhase === "betting"){
                this.target.innerHTML += this.getBetString();
            }
            else if(table.get_gamePhase === "acting"){
                this.target.innerHTML += this.getActionString();
            }
            
        }
    }

    public getCardString(card: Card): string {
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

    public getPlayerString(player: Player): string {
        let playerStatus: string = ``;
        let playerHands: string = ``;
        if (player.type === "house") {
            playerHands += this.getCardString(player.get_hand[0]);
        } else {
            for (let i = 0; i < 2; i++) {
                playerHands += this.getCardString(player.get_hand[i]);
            }
        }
        if (player.type === "house") {
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
        } else if(player.type === "ai") {
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
        }else{
            playerStatus +=
                `
            <div class="playerStatus">
                  <div class="">
                      <h6 class="text-center text-blue">${player.get_name}</h6>
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

    public getBetString(): string {
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
                <button class="btn btn-success">Submit your bet</button>
            </div>
            `

        return bet;
    }

    public getActionString(): string{
        let actionString: string = ``;

        actionString += 
            `
            <div id="playerAction">
                <div class="d-flex justify-content-center p-2 py-5">
                    <button class="col-2 col-lg-1 btn btn-light mx-1">Surrender</button>
                    <button class="col-2 col-lg-1 btn btn-success mx-1">Stand</button>
                    <button class="col-2 col-lg-1 btn btn-warning mx-1">Hit</button>
                    <button class="col-2 col-lg-1 btn btn-danger mx-1">Double</button>
                </div>
            </div>
            `
        return actionString;
    }
}