import { View } from "./View/View";
import { Controller } from "./Controller/Controller";
import { Card } from "./Model/Card";
import { Player } from "./Model/Player";
import { Table } from "./Model/Table";
import { GameDecision } from "./Model/GameDecision";



let tableTest = new Table("blackjack");
let player1: Player = new Player("user", "user", "blackjack");
let player2: Player = new Player("ai1", "ai", "blackjack");
let player3: Player = new Player("ai2", "ai", "blackjack");




// tableTest.set_player = player1;
// tableTest.set_player = player2;
// tableTest.set_player = player3;

// let gameDecision: GameDecision = player2.promptPlayer(null);

// console.log(gameDecision.get_action);
// console.log(gameDecision.get_amount);

// View.renderTablePage(tableTest);



let controller: Controller = new Controller();

controller.startGame();
