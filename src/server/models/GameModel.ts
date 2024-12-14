// Schema for tracking game states, players, and history

/**
 * GameModel.ts
 * -------------
 * This file defines the schema for the "Game" model in the database.
 * It manages the structure and rules for storing game states, including
 * the board configuration, players, sequences, and other game metadata.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Game interface
export interface IGame extends Document {
  gameName: string;
  players: string[];
  board: (string | null)[][];
  playerHands: string[][];
  currentTurn: number;
  sequences: { player: string; sequence: number[][] }[];
  createdAt: Date;
}

// Define the Game schema
const GameSchema: Schema = new Schema(
  {
    gameName: { type: String, required: true },
    players: { type: [String], required: true },
    board: { type: [[Schema.Types.Mixed]], required: true },
    playerHands: { type: [[String]], required: true },
    currentTurn: { type: Number, required: true },
    sequences: {
      type: [
        {
          player: { type: String, required: true },
          sequence: { type: [[Number]], required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// Create and export the Game model
const GameModel: Model<IGame> = mongoose.model<IGame>("Game", GameSchema);
export default GameModel;
