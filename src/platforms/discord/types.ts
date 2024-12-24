import type { PlayBackData } from "../../types/tcg_base.types";
import type { GameDetails } from "../../web3/interactions.read";

export enum GameState {
  LOBBY = "LOBBY",
  PLAYING = "PLAYING",
  CARDS = "CARDS",
  CONCLUDED = "CONCLUDED",
  CAULDRON = "CAULDRON",
  WATCHING_GAME = "WATCHING_GAME",
}

export type GameSettings<T extends GameState> = T extends "LOBBY" ? undefined : T extends "PLAYING" ? {
  gameDetail: GameDetails,
  player1Pfp: string,
  player2Pfp: string,
  iPlayer1Owner: boolean,
} : T extends "CARDS" ? undefined : T extends "CONCLUDED" ? {
  hasWon: boolean,
} : T extends "CAULDRON" ? undefined : T extends "WATCHING_GAME" ? PlayBackData[number] : never;
