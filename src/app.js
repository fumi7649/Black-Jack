"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller/Controller");
const Player_1 = require("./Model/Player");
const Table_1 = require("./Model/Table");
let tableTest = new Table_1.Table("blackjack");
let player1 = new Player_1.Player("user", "user", "blackjack");
let player2 = new Player_1.Player("ai1", "ai", "blackjack");
let player3 = new Player_1.Player("ai2", "ai", "blackjack");
// let deck = new Deck("blackjack");
// deck.shuffle();
// tableTest.set_player = player1;
// tableTest.set_player = player2;
// tableTest.set_player = player3;
// // for(let i = 0; i < tableTest.get_players.length;i++){
// //   console.log(tableTest.get_players[i]);
// // }
// View.renderTablePage(tableTest);
Controller_1.Controller.startGame();
