"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const Table_1 = require("../Model/Table");
const Player_1 = require("../Model/Player");
const View_1 = require("../View/View");
class Controller {
    static startGame() {
        View_1.View.renderLandingPage();
        let inputName = document.querySelectorAll("#inputName")[0];
        let selectGameType = document.querySelectorAll("#selectGameType")[0];
        let startGame = document.querySelectorAll("#startGame")[0];
        let loginGame = document.querySelectorAll("#loginGame")[0];
        startGame.addEventListener("click", function () {
            if (inputName.value === "") {
                alert("名前を入力してください");
            }
            else {
                let table = new Table_1.Table(selectGameType.value);
                let user;
                if (inputName.name === "ai") {
                    user = new Player_1.Player("ai", "ai", selectGameType.value);
                }
                else {
                    user = new Player_1.Player(inputName.value, "user", selectGameType.value);
                }
                table.set_player = user;
                if (selectGameType.value === "blackjack") {
                    let bot1 = new Player_1.Player("ai1", "ai", "blackjack");
                    let bot2 = new Player_1.Player("ai2", "ai", "blackjack");
                    table.set_player = bot1;
                    table.set_player = bot2;
                }
                View_1.View.renderTablePage(table);
            }
        });
        loginGame.addEventListener("click", function () {
            let user;
            if (inputName.value === "") {
                alert("名前を入力してください");
            }
            else {
                let saveChips = localStorage.getItem(inputName.value);
                if (saveChips === null) {
                    alert("データはありません。");
                    return;
                }
                else {
                    saveChips = parseInt(saveChips);
                    user = new Player_1.Player(inputName.value, "user", selectGameType.value, saveChips);
                }
                let table = new Table_1.Table(selectGameType.value);
                table.set_player = user;
                if (selectGameType.value === "blackjack") {
                    let bot1 = new Player_1.Player("ai1", "ai", "blackjack");
                    let bot2 = new Player_1.Player("ai2", "ai", "blackjack");
                    table.set_player = bot1;
                    table.set_player = bot2;
                }
                View_1.View.renderTablePage(table);
            }
        });
    }
    static addBetsEvent(table) {
        let decreaseBets = document.querySelectorAll(".decreaseBets");
        let increaseBets = document.querySelectorAll(".increaseBets");
        let inputBets = document.querySelectorAll(".inputBets");
        for (let i = 0; i < decreaseBets.length; i++) {
            Controller.addBetsEventHelper(inputBets[i], table.get_betDenomination[i], decreaseBets[i], table.turnPlayer.get_chips);
        }
        for (let i = 0; i < increaseBets.length; i++) {
            Controller.addBetsEventHelper(inputBets[i], table.get_betDenomination[i], increaseBets[i], table.turnPlayer.get_chips);
        }
    }
    static addBetsEventHelper(inputBets, betAmount, betButton, chips) {
        if (betButton.innerHTML === "-") {
            betButton.addEventListener("click", function () {
                if (parseInt(inputBets.value) > 0) {
                    inputBets.value = String(parseInt(inputBets.value) - betAmount);
                }
            });
        }
        else if (betButton.innerHTML === "+") {
            betButton.addEventListener("click", function () {
                if (parseInt(inputBets.value) < chips && Controller.totalBets() < chips) {
                    inputBets.value = String(parseInt(inputBets.value) + betAmount);
                }
            });
        }
    }
    static addBetSubmitEvent(table) {
        let submitBetsButton = document.querySelectorAll("#submitBetsButton")[0];
        submitBetsButton.addEventListener("click", function () {
            let totalBets = Controller.totalBets();
            if (totalBets === 0) {
                alert("Chipを賭けてください");
            }
            else {
                table.haveTurn(totalBets);
                View_1.View.renderTablePage(table);
            }
        });
    }
    static addActionEvent(table) {
        let actionButton = document.querySelectorAll(".actionButton");
        let doubleButton = document.querySelectorAll("#double")[0];
        let surrenderButton = document.querySelectorAll("#surrender")[0];
        if (table.get_players[0].get_hand.length !== 2) {
            doubleButton.disabled = true;
            surrenderButton.disabled = true;
        }
        for (let i = 0; i < actionButton.length; i++) {
            actionButton[i].addEventListener("click", function () {
                console.log(actionButton[i].value);
                table.haveTurn(actionButton[i].value);
                View_1.View.renderTablePage(table);
            });
        }
    }
    static addCloseResultOrRuleEvent(table) {
        let closeResults = document.querySelectorAll("#closeResults")[0];
        let roundResults = document.querySelectorAll("#roundResults")[0];
        let closeRule = document.querySelectorAll("#closeRule")[0];
        let gameRule = document.querySelectorAll("#gameRule")[0];
        closeResults.addEventListener("click", function () {
            if (table.get_gamePhase === "roundOver") {
                table.set_gamePhase = "stopOrContinue";
                View_1.View.renderTablePage(table);
            }
            else {
                View_1.View.displayNone(roundResults);
            }
        });
        closeRule.addEventListener("click", function () {
            View_1.View.displayNone(gameRule);
        });
    }
    static addStopOrContinueGameEvent(table) {
        let continueButton = document.querySelectorAll("#continueGameButton")[0];
        let stopButton = document.querySelectorAll("#stopGameButton")[0];
        continueButton.addEventListener("click", function () {
            table.nextGame();
            View_1.View.renderTablePage(table);
        });
        stopButton.addEventListener("click", function () {
            let userName = table.get_players[0].get_name;
            let userChips = String(table.get_players[0].get_chips);
            localStorage.setItem(userName, userChips);
            alert("Saved your data, Please put the same when you login.");
            Controller.startGame();
        });
    }
    static addNewGameEvent() {
        let newGameButton = document.querySelectorAll("#newGameButton")[0];
        newGameButton.addEventListener("click", function () {
            Controller.startGame();
        });
    }
    static addRuluAndLogCheckEvent() {
        let ruleButton = document.querySelectorAll("#ruleButton")[0];
        let gameLogButton = document.querySelectorAll("#gameLogButton")[0];
        let resultLog = document.querySelectorAll("#roundResults")[0];
        let gameRule = document.querySelectorAll("#gameRule")[0];
        ruleButton.addEventListener("click", function () {
            View_1.View.displayBlock(gameRule);
        });
        gameLogButton.addEventListener("click", function () {
            View_1.View.displayBlock(resultLog);
        });
    }
    static totalBets() {
        let totalBets = 0;
        let inputBets = document.querySelectorAll(".inputBets");
        for (let i = 0; i < inputBets.length; i++) {
            totalBets += parseInt(inputBets[i].value);
        }
        return totalBets;
    }
}
exports.Controller = Controller;
