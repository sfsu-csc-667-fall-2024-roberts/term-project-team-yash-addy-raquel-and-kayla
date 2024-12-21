export interface GameState {
    id: string;
    players: Map<string, Player>;
  }
  
  export interface Player {
    id: string;
    hand: Card[];
  }
  
  export interface Card {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    value: string;
  }