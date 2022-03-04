
import { Table } from "../Model/Table";
import { Player } from "../Model/Player";
import { View } from "../View/View";

export class Controller{
  private view: View;
  constructor(){
    this.view = new View();
    this.view.renderLandingPage();
  }

  public startGame(): void{
    let inputName = document.querySelectorAll("#inputName")[0] as HTMLInputElement;
    let selectGameType = document.querySelectorAll("#selectGameType")[0] as HTMLSelectElement;
    let startGame = document.querySelectorAll("#startGame")[0];
    let view: View = this.view;
    startGame.addEventListener("click", function(){
       if(inputName.value === ""){
          alert("名前を入力してください");
       }
       else{
        let table: Table = new Table(selectGameType.value);
        let user: Player;
        if(inputName.name === "ai"){
          user = new Player("ai", "ai", selectGameType.value);
        }else{
          user = new Player(inputName.value, "user", selectGameType.value);
        }
          table.set_player = user;
        if(selectGameType.value === "blackjack"){
          let bot1: Player = new Player("ai1", "ai", "blackjack");
          let bot2: Player = new Player("ai2", "ai", "blackjack");
          table.set_player = bot1;
          table.set_player = bot2;
        }
        view.renderTablePage(table);
       }
    })
  }
}