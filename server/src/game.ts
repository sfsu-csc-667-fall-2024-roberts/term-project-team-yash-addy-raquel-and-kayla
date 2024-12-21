import type { GameState, Player } from './types.js';

export class Game {
  private state: GameState;

  constructor(id: string) {
    this.state = {
      id,
      players: new Map()
    };
  }

  public getState(): GameState {
    return this.state;
  }
}