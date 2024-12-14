// Schema for managing card distribution and usage

/**
 * CardModel.ts
 * -------------
 * This file defines the schema for the "Card" model in the database.
 * It manages the structure and rules for tracking card ownership and usage
 * during the Sequence game.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Card interface
export interface ICard extends Document {
  cardValue: string; // E.g., "Ace of Spades"
  ownerId: string | null; // Player ID or null if not assigned
  gameId: string; // The game to which the card belongs
  status: "deck" | "hand" | "discarded"; // Current state of the card
}

// Define the Card schema
const CardSchema: Schema = new Schema(
  {
    cardValue: { type: String, required: true },
    ownerId: { type: String, default: null },
    gameId: { type: String, required: true },
    status: {
      type: String,
      enum: ["deck", "hand", "discarded"],
      required: true,
    },
  },
  { timestamps: true },
);

// Create and export the Card model
const CardModel: Model<ICard> = mongoose.model<ICard>("Card", CardSchema);
export default CardModel;
