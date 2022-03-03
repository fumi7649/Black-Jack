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
            <div id="initialPage">
                <div class="bg-green vh-100 d-flex justify-content-center align-items-center flex-column">
                    <h5 class="text-white">Welcom to Card Game!</h5>
                    <div class="form-group">
                        <input type="text" placeholder="name" class="form-control">
                        <select class="form-select">
                            <option value="blackjack">Blackjack</option>
                            <option value="porker">Poker</option>
                        </select>
                        <button class="btn btn-success form-control my-2">Start Game</button>
                    </div>
                </div>
            </div>
            `
        }
    }

    public renderTablePage(table: Table): void {

        if (this.target != null) {
            let playersString: string = ``;

            for (let player of table.get_players) {
                playersString += this.getPlayerString(player);
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
                </div> 
                <div id="playersDiv" class="d-flex justify-content-between p-2">
                    ${playersString}
                </div>
            
                `;
            if(table.get_gamePhase === "betting"){
                this.target.innerHTML += this.getBetString();
            }
            
        }
    }

    public getCardString(card: Card): string {
        let cardString: string = ``;
        if (card === undefined) {
            cardString +=
                `
            <div class="bg-white p-2 mx-2">
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
                  <div class="p-4">
                      <h5 class="text-center text-white">${player.get_name}</h5>
                  </div>
                  <div id="player1Infomation" class="d-flex justify-content-around text-white ">
                      <p>S: ${player.get_gameStatus}</p>
                  </div>
                  <div class="d-flex justify-content-center playerHands">
                        ${playerHands}
                  </div> 
            </div>
            `;
        } else {
            playerStatus +=
                `
            <div class="playerStatus">
                  <div class="p-4">
                      <h5 class="text-center text-white">${player.get_name}</h5>
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
            <div id="betDivs" class="d-flex w-50 my-2 m-auto">
                <div class="input-group">
                    <button class="btn btn-danger ">-</button>
                    <input type="text" placeholder="0" class="input-number text-center" size="2">
                    <button class="btn btn-success">+</button>
                </div>
                <div class="input-group">
                    <button class="btn btn-danger">-</button>
                    <input type="text" placeholder="0" class="input-number text-center" size="2">
                    <button class="btn btn-success">+</button>
                </div>
                <div class="input-group">
                    <button class="btn btn-danger">-</button>
                    <input type="text" placeholder="0" class="input-number text-center" size="2">
                    <button class="btn btn-success">+</button>
                </div>
                <div class="input-group">
                    <button class="btn btn-danger">-</button>
                    <input type="text" placeholder="0" class="input-number text-center" size="2">
                    <button class="btn btn-success">+</button>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button class="btn btn-success">Submit your bet</button>
            </div>
            `

        return bet;
    }
}