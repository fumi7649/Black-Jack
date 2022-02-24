import { Player } from "./Player";
import { Deck } from "./Deck";

export class Talbe{
  private gameType: string;
  private betDenomination: string[];
  private deck: Deck;
  private players = [];
  private house: Player
}