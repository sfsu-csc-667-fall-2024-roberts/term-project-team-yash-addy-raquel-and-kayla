"use strict";
// Manages game state logic, turn validation, and sequences
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const GameModel_1 = __importDefault(require("../models/GameModel"));
class GameController {
  /**
   * Initialize a new game.
   * Sets up the game board, assigns cards to players, and initializes player turns.
   *
   * @param req - Express request object (should include game settings and player info).
   * @param res - Express response object.
   */
  static initializeGame(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const game = yield GameModel_1.default.create(gameState);
        res.status(201).json({ message: "Game initialized.", game });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to initialize game." });
      }
    });
  }
  /**
   * Shuffle a deck of cards.
   * @returns A shuffled deck of cards.
   */
  static shuffleDeck() {
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
  static generateDeck() {
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
    const deck = [];
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
  static dealCards(playerCount, deck) {
    const hands = Array.from({ length: playerCount }, () => []);
    const cardsPerPlayer = 7; // Adjust based on player count
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < playerCount; j++) {
        hands[j].push(deck.pop());
      }
    }
    return hands;
  }
  /**
   * Initialize a blank game board (10x10 grid).
   * @returns A 2D array representing the board.
   */
  static initializeBoard() {
    return Array.from({ length: 10 }, () => Array(10).fill(null));
  }
}
exports.default = GameController;
