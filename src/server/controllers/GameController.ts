// Manages game state logic, turn validation, and sequences

/**
 * This file contains the core logic for managing the Sequence game.
 * Handles game init, player actions, game status updates, and sequence
 * detection. Logic ensures that the rules are properly enforced and that
 * game state is updated consistently.

 * 1. Game Initialization:
 *      -Setup game board and distribute cards to player
 *      -Initialize player turns and team assignments
 *
 * 2. Player Actions:
 *      -Validate player moves
 *      -Handle special card rules
 *      -Update the game board and player states after each move
 *
 * 3. Sequence Detection:
 *      -Check for completed sequences of 5 chips (horizontal, vertical, diagnoal)
 *      -Handle overlapping sequences and sequence soaring
 *
 * 4. Game State Management:
 *      -Persist the game state to the database after every move
 *      -Provide methods for reloading the game state when a player reconnects
 *
 * 5. Winning Conditions:
 *      -Detect when a team has achieved the requireed number of sequences to win
 *      -End the game and announce the winner

 * This file itneracts with:
 *      -The Game model to update and persist game state
 *      -The Card model to manage card distribution and usage
 *      -Real time communication via WebSocket events
 */

import { Request, Response } from "express";
import GameModel from "../models/GameModel";
import CardModel from "../models/CardModels";

class GameController {
  /**
   * Initialize a new game.
   * Sets up the game board, assigns cards to players, and initializes player turns.
   *
   * @param req - Express request object (should include game settings and player info).
   * @param res - Express response object.
   */
  static async initializeGame(req: Request, res: Response): Promise<void> {
    try {
      const { gameName, players } = req.body;

      // Validate input
      if (!gameName || !players || players.length < 2) {
        res.status(400).json({ error: "Invalid game setup data." });
        return;
      }

      // Shuffle and deal cards
      const shuffledDeck = GameController.shuffleDeck();
      const playerHands = GameController.dealCards(
        players.length,
        shuffledDeck,
      );

      // Create initial game state
      const gameState = {
        gameName,
        players,
        board: GameController.initializeBoard(),
        playerHands,
        currentTurn: 0, // First player to play
        sequences: [],
      };

      // Save the game to the database
      const game = await GameModel.create(gameState);
      res.status(201).json({ message: "Game initialized.", game });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to initialize game." });
    }
  }

  /**
   * Shuffle a deck of cards.
   * @returns A shuffled deck of cards.
   */
  private static shuffleDeck(): string[] {
    const deck = GameController.generateDeck();
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Generate a standard deck of cards (2 copies for Sequence).
   * @returns An array representing the full deck.
   */
  private static generateDeck(): string[] {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "Jack",
      "Queen",
      "King",
      "Ace",
    ];
    const deck: string[] = [];
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        deck.push(`${rank} of ${suit}`);
        deck.push(`${rank} of ${suit}`); // Two copies for Sequence
      });
    });
    return deck;
  }

  /**
   * Deal cards to players.
   * @param playerCount - Number of players in the game.
   * @param deck - The shuffled deck of cards.
   * @returns An array where each element represents a player's hand.
   */
  private static dealCards(playerCount: number, deck: string[]): string[][] {
    const hands: string[][] = Array.from({ length: playerCount }, () => []);
    const cardsPerPlayer = 7; // Adjust based on player count

    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < playerCount; j++) {
        hands[j].push(deck.pop()!);
      }
    }
    return hands;
  }

  /**
   * Initialize a blank game board (10x10 grid).
   * @returns A 2D array representing the board.
   */
  private static initializeBoard(): string[][] {
    return Array.from({ length: 10 }, () => Array(10).fill(null));
  }
}

export default GameController;
