import { View } from "./View/View";
import { Controller } from "./Controller/Controller";
import { Card } from "./Model/Card";
import { Player } from "./Model/Player";
import { Table } from "./Model/Table";



// let viewTest = new View();
// let tableTest = new Table("blackjack");
// let player1: Player = new Player("ai1", "ai", "blackjack");
// let player2: Player = new Player("user", "user", "blackjack");
// let player3: Player = new Player("ai2", "ai", "blackjack");


// tableTest.set_player = player1;
// tableTest.set_player = player2;
// tableTest.set_player = player3;


// viewTest.renderTablePage(tableTest);

let controller: Controller = new Controller();

controller.startGame();
