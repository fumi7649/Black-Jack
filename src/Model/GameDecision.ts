export class GameDecision{
  private action: string;
  private amount: number;

  constructor(action: string, amount: number){
    this.action = action;
    this.amount = amount;
  }

  public get get_action(): string{
      return this.action;
  }

  public get get_amount(): number{
    return this.amount;
  }
}