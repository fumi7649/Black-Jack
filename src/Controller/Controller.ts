
import { Table } from "../Model/Table";
import { Player } from "../Model/Player";
import { View } from "../View/View";

export class Controller{


  constructor(){
    View.renderLandingPage();
  }

  public startGame(): void{
    let inputName = document.querySelectorAll("#inputName")[0] as HTMLInputElement;
    let selectGameType = document.querySelectorAll("#selectGameType")[0] as HTMLSelectElement;
    let startGame = document.querySelectorAll("#startGame")[0];
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
        View.renderTablePage(table);
       }
    })
  }

  public static addBetsEvent(table: Table): void{
    
    let decreaseBets = document.querySelectorAll(".decreaseBets") as NodeListOf<HTMLButtonElement>;
    let increaseBets = document.querySelectorAll(".increaseBets") as NodeListOf<HTMLButtonElement>;
    let inputBets = document.querySelectorAll(".inputBets") as NodeListOf<HTMLInputElement>;
    

    for(let i = 0;i < decreaseBets.length;i++){
      Controller.addBetsEventHelper(inputBets[i], table.get_betDenomination[i], decreaseBets[i], table.turnPlayer.get_chips);
    }
    for(let i = 0; i < increaseBets.length;i ++){
      Controller.addBetsEventHelper(inputBets[i], table.get_betDenomination[i], increaseBets[i], table.turnPlayer.get_chips);
    }
  }

  public static addBetsEventHelper(inputBets: HTMLInputElement, betAmount: number, betButton: HTMLButtonElement, chips: number): void{
    if(betButton.innerHTML === "-"){
      betButton.addEventListener("click", function(){
        if(parseInt(inputBets.value) > 0){
          inputBets.value = String(parseInt(inputBets.value) - betAmount);
        }      
      })
    }
    else if(betButton.innerHTML === "+"){
      betButton.addEventListener("click", function(){
        if(parseInt(inputBets.value) < chips && Controller.totalBets() < chips){
          inputBets.value = String(parseInt(inputBets.value) + betAmount);
        } 
      })
    }
  }

  public static addBetSubmitEvent(table: Table): void{
    let submitBetsButton = document.querySelectorAll("#submitBetsButton")[0];
    submitBetsButton.addEventListener("click", function(){
      let totalBets:number = Controller.totalBets();
      table.haveTurn(totalBets); 
      View.renderTablePage(table);
    })
  }

  public static addActionEvent(table: Table): void{
     let actionButton = document.querySelectorAll(".actionButton") as NodeListOf<HTMLButtonElement>;

     for(let i = 0;i < actionButton.length;i++){
       actionButton[i].addEventListener("click", function(){
         console.log(table.turnPlayer);
         table.haveTurn(actionButton[i].value);
         View.renderTablePage(table);
       })
     }
  }

  public static addOKEvent(table: Table): void{
    let roundResults = document.querySelectorAll("#roundResults")[0];
    let okResults = document.querySelectorAll("#okResults")[0];
    
    okResults.addEventListener("click", function(){
        roundResults.innerHTML = 
            `
            ${View.getNextGameButtonStirng(table)}
            `
     })
  }

  public static totalBets(): number{
    let totalBets:number = 0;
    let inputBets = document.querySelectorAll(".inputBets") as NodeListOf<HTMLInputElement>;
    for(let i = 0;i < inputBets.length;i++){
      totalBets += parseInt(inputBets[i].value);
    }
    return totalBets;
  }
  
}