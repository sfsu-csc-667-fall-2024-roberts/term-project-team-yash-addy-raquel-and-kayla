"use strict";
// Schema for tracking game states, players, and history
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GameModel.ts
 * -------------
 * This file defines the schema for the "Game" model in the database.
 * It manages the structure and rules for storing game states, including
 * the board configuration, players, sequences, and other game metadata.
 */
const mongoose_1 = __importStar(require("mongoose"));
// Define the Game schema
const GameSchema = new mongoose_1.Schema(
  {
    gameName: { type: String, required: true },
    players: { type: [String], required: true },
    board: { type: [[mongoose_1.Schema.Types.Mixed]], required: true },
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
const GameModel = mongoose_1.default.model("Game", GameSchema);
exports.default = GameModel;
