"use strict";
// Schema for managing card distribution and usage
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
 * CardModel.ts
 * -------------
 * This file defines the schema for the "Card" model in the database.
 * It manages the structure and rules for tracking card ownership and usage
 * during the Sequence game.
 */
const mongoose_1 = __importStar(require("mongoose"));
// Define the Card schema
const CardSchema = new mongoose_1.Schema(
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
const CardModel = mongoose_1.default.model("Card", CardSchema);
exports.default = CardModel;
