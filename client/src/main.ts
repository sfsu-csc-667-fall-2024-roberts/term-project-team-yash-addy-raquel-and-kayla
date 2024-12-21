// // const ws = new WebSocket('ws://localhost:3000');

// // ws.onopen = () => {
// //     console.log('Connected to server');
// // };

// // // ws.onmessage = (event) => {
// // //     console.log('Received:', JSON.parse(event.data));
// // // };

// // import { GameBoard } from './game';

// // // document.addEventListener('DOMContentLoaded', () => {
// // //   const board = new GameBoard('game');
  
// // //   const ws = new WebSocket('ws://localhost:3000');
  
// // //   ws.onmessage = (event) => {
// // //     const data = JSON.parse(event.data);
// // //     // Handle game state updates (δ)
// // //     console.log('Received:', data);
// // //   };
// // // });

// // document.addEventListener('DOMContentLoaded', () => {
// //   const board = new GameBoard('game');
// //   const debug = document.getElementById('debug')!;

// //   // Debug state changes
// //   board.addEventListener('stateChange', ((e: CustomEvent) => {
// //     debug.textContent = `Game State: ${JSON.stringify(e.detail, null, 2)}`;
// //   }) as EventListener);

// //   // Test card selection (simulated hand)
// //   const testCard = {
// //       suit: 'hearts' as const,
// //       value: '5',
// //       position: undefined
// //   };

// //   board.selectCard(testCard);

// //   console.log('Game initialized with test card:', testCard);
// // });
// // client/src/main.ts
// // import { GameBoard } from './game';
// // import { Deck } from './deck';

// // document.addEventListener('DOMContentLoaded', () => {
// //     const board = new GameBoard('game');
// //     const deck = new Deck();
// //     const debug = document.getElementById('debug')!;
    
// //     // Initialize game with shuffled deck
// //     deck.shuffle();
    
// //     // Deal initial hands
// //     const player1Hand = deck.deal(7);
// //     const player2Hand = deck.deal(7);
    
// //     // Debug state changes
// //     board.addEventListener('stateChange', ((e: CustomEvent) => {
// //         debug.textContent = JSON.stringify({
// //             ...e.detail,
// //             player1Hand,
// //             player2Hand,
// //             remainingCards: deck.getCardsRemaining()
// //         }, null, 2);
// //     }) as EventListener);
    
// //     // For testing, let's select the first card from player 1's hand
// //     if (player1Hand.length > 0) {
// //         board.selectCard(player1Hand[0]);
// //     }
    
// //     console.log('Game initialized with hands:', {
// //         player1: player1Hand,
// //         player2: player2Hand
// //     });
// // });
// // client/src/main.ts
// import { GameBoard } from './game';
// import { Deck } from './deck';
// import { PlayerHand } from './components/playerHand';

// document.addEventListener('DOMContentLoaded', () => {
//     const board = new GameBoard('game');
//     const deck = new Deck();
//     const debug = document.getElementById('debug')!;
    
//     // Initialize game with shuffled deck
//     deck.shuffle();
    
//     // Deal initial hands
//     const player1Hand = deck.deal(7);
//     const player2Hand = deck.deal(7);
    
//     // Debug state changes
//     board.addEventListener('stateChange', ((e: CustomEvent) => {
//         debug.textContent = JSON.stringify({
//             ...e.detail,
//             player1Hand,
//             player2Hand,
//             remainingCards: deck.getCardsRemaining()
//         }, null, 2);
//     }) as EventListener);
    
//     // For testing, let's select the first card from player 1's hand
//     if (player1Hand.length > 0) {
//         board.selectCard(player1Hand[2]);
//     }
    
//     console.log('Game initialized with hands:', {
//         player1: player1Hand,
//         player2: player2Hand
//     });
//     const initialCards = deck.deal(7);
    
//     // Initialize player hand
//     const playerHand = new PlayerHand({
//         containerId: 'player-hand',
//         maxCards: 7,
//         onCardSelect: (card) => {
//             console.log('Selected card:', card);
//             // Here you would integrate with your game board
//         }
//     });
    
//     // Set initial cards
//     playerHand.setCards(initialCards);
//     playerHand.setPlayerId('Player 1');
// });

// client/src/main.ts
import { PlayerHand } from './components/playerHand';
import { GameBoard } from './game';
import { Deck } from './deck';
import type { Card } from './types';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components (Γ)
    const board = new GameBoard('game');
    const deck = new Deck();
    const debug = document.getElementById('debug')!;
    
    // Setup player hand (Η)
    const playerHand = new PlayerHand({
        containerId: 'player-hand',
        maxCards: 7,
        onCardSelect: (card: Card) => {
            console.log('Card selected:', card);
            board.selectCard(card);
        }
    });
    
    // Initialize game state (Σ₀)
    deck.shuffle();
    const initialCards = deck.deal(7);
    playerHand.setCards(initialCards);
    playerHand.setPlayerId('Player 1');
    
    // State change monitoring (δ)
    board.addEventListener('stateChange', ((e: CustomEvent) => {
        debug.textContent = JSON.stringify({
            ...e.detail,
            currentHand: initialCards,
            remainingCards: deck.getCardsRemaining()
        }, null, 2);
    }) as EventListener);
});