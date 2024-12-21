// client/src/game.ts
import { BOARD_MAPPING } from "./types";

// Position vector p ∈ ℤ²
type Position = [number, number];

// Card definitions
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type CardValue =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  value: CardValue;
  position?: Position; // Optional mapping γ(card) → p
}

interface BoardCell {
  card?: Card; // Card placement function π(p)
  isCorner: boolean; // Corner predicate κ(p)
  chip?: string; // Player occupation function ω(p)
}

interface GameState {
  currentPlayer: string; // Player turn function θ(t)
  selectedCard?: Card; // Card selection state σ(t)
}

interface Sequence {
  positions: Position[]; // Sequence vector s ∈ (ℤ²)ⁿ
  playerId: string; // Player identifier function ρ(s)
}

// Board Implementation (β)
export class GameBoard {
  private static readonly BOARD_SIZE = 10; // n = |B| = 10
  private board: BoardCell[][]; // B ∈ ℤⁿˣⁿ
  private element: HTMLElement; // DOM reference δ
  private state: GameState = {
    // Game state function Γ(t)
    currentPlayer: "player1",
  };
  private sequences: Sequence[] = []; // Sequence set S

  constructor(containerId: string) {
    this.element = document.getElementById(containerId) as HTMLElement;
    this.board = this.initializeBoard();
    this.render();
    this.element.addEventListener("click", this.handleBoardClick.bind(this));
    this.emit("stateChange", this.getState());
  }

  private initializeBoard(): BoardCell[][] {
    return Array(GameBoard.BOARD_SIZE)
      .fill(null)
      .map((_, i) =>
        Array(GameBoard.BOARD_SIZE)
          .fill(null)
          .map((_, j) => ({
            isCorner: this.isCorner([i, j]),
            chip: undefined,
            card: this.getCardForPosition([i, j]),
          })),
      );
  }

  private checkSequences(position: Position, playerId: string): void {
    // Define direction vectors (δ)
    const directions: Position[] = [
      [0, 1], // horizontal →
      [1, 0], // vertical ↓
      [1, 1], // diagonal ↘
      [1, -1], // diagonal ↗
    ];

    directions.forEach((dir) => {
      const sequence = this.findSequence(position, dir, playerId);
      if (sequence.length >= 5) {
        this.sequences.push({ positions: sequence, playerId });
        this.highlightSequence(sequence);
      }
    });
  }

  private findSequence(
    start: Position,
    dir: Position,
    playerId: string,
  ): Position[] {
    const sequence: Position[] = [];
    const [dx, dy] = dir;

    // Check in both directions (±δ)
    for (let factor of [-1, 1]) {
      let [x, y] = start;
      while (true) {
        // Boundary check: β(p) ∈ B
        if (x < 0 || x >= 10 || y < 0 || y >= 10) break;

        const cell = this.board[x][y];
        if (!cell?.chip || cell.chip !== playerId) break;

        if (factor === 1) sequence.push([x, y]);
        else sequence.unshift([x, y]);

        x += dx * factor;
        y += dy * factor;
      }
    }

    return sequence;
  }

  private highlightSequence(positions: Position[]): void {
    positions.forEach(([x, y]) => {
      const cell = this.board[x][y];
      if (cell?.chip) {
        // Add visual indicator (ν)
        const cellElement = document.querySelector(
          `.board-cell[data-position="${x},${y}"]`,
        );
        cellElement?.classList.add("sequence");
      }
    });
  }

  private handleBoardClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cellElement = target.closest(".board-cell");

    if (!cellElement) {
      console.log("Click missed board cell");
      return;
    }

    const position = this.getCellPosition(cellElement as HTMLElement);
    console.log("Board click:", {
      position,
      selectedCard: this.state.selectedCard,
      currentPlayer: this.state.currentPlayer,
    });

    // Position validation function: φ(p)
    if (position[0] === -1 || position[1] === -1) {
      console.error("Invalid position detected");
      return;
    }

    // Validation and placement logic: λ(p, c)
    if (!this.state.selectedCard) {
      console.log("No card selected");
      return;
    }

    if (this.isValidPlacement(this.state.selectedCard, position)) {
      this.placeChip(position, this.state.currentPlayer);
      this.checkSequences(position, this.state.currentPlayer);
      this.state.currentPlayer =
        this.state.currentPlayer === "player1" ? "player2" : "player1";
      this.state.selectedCard = undefined;
      this.emit("stateChange", this.getState());
    } else {
      console.log(
        "Invalid placement for selected card:",
        this.state.selectedCard,
      );
    }
  }

  private getCellPosition(element: HTMLElement): Position {
    const positionAttr = element.getAttribute("data-position");
    console.log("Position attribute:", positionAttr);

    if (!positionAttr) {
      console.error("No position data found on cell");
      return [-1, -1]; // Invalid position sentinel
    }

    const [x, y] = positionAttr.split(",").map(Number);
    console.log("Parsed position:", x, y);

    // Validate position bounds: β(p) ∈ [0,9]²
    if (x < 0 || x > 9 || y < 0 || y > 9 || isNaN(x) || isNaN(y)) {
      console.error("Invalid position coordinates");
      return [-1, -1];
    }

    return [x, y];
  }

  public selectCard(card: Card): void {
    this.state.selectedCard = card;
  }

  private emit(event: string, data: any): void {
    const customEvent = new CustomEvent(event, { detail: data });
    this.element.dispatchEvent(customEvent);
  }

  public getState(): any {
    return {
      board: this.board,
      sequences: this.sequences,
      currentPlayer: this.state.currentPlayer,
    };
  }

  public isValidPlacement(card: Card, position: Position): boolean {
    // Define placement validity function φ(c, p) → {true, false}
    const [x, y] = position;
    const cell = this.board[x][y];

    // Rule 1: Position must match card mapping
    // Generate possible mapping keys (with suffixes)
    const baseKey = `${card.value}${card.suit[0].toUpperCase()}`;
    const possibleKeys = [
      baseKey,
      `${baseKey}1`,
      `${baseKey}2`,
      `${baseKey}3`,
      `${baseKey}4`,
    ];

    // Check if any of the possible positions match
    const isValidPosition = possibleKeys.some((key) => {
      return true;
      // const mappedPos = BOARD_MAPPING[key];
      // return mappedPos && mappedPos[0] === x && mappedPos[1] === y;
    });

    console.log("Card mapping check:", {
      card,
      baseKey,
      possibleKeys,
      position: [x, y],
      isValidPosition,
    });

    if (!isValidPosition) {
      console.log("Failed: Position does not match card mapping");
      return false;
    }

    // Rule 2: Cell must not have chip
    if (cell.chip) {
      console.log("Failed: Cell already has a chip");
      return false;
    }

    // Rule 3: Cannot place on corners
    if (cell.isCorner) {
      console.log("Failed: Cannot place on corner");
      return false;
    }

    return true;
  }

  public placeChip(position: Position, playerId: string): boolean {
    const [x, y] = position;
    const cell = this.board[x][y];

    if (!cell.chip && !cell.isCorner) {
      cell.chip = playerId;
      this.render();
      return true;
    }
    return false;
  }

  private isCorner(pos: Position): boolean {
    const [x, y] = pos;
    return (
      (x === 0 || x === GameBoard.BOARD_SIZE - 1) &&
      (y === 0 || y === GameBoard.BOARD_SIZE - 1)
    );
  }

  private getCardForPosition(pos: Position): Card | undefined {
    const [x, y] = pos;

    // Inverse mapping: Position → Card (Π⁻¹)
    const cardKey = Object.entries(BOARD_MAPPING).find(
      ([_, [px, py]]) => px === x && py === y,
    )?.[0];

    if (!cardKey) return undefined;

    const suit = cardKey.slice(-1) as Suit;
    const value = cardKey.slice(0, -1) as CardValue;
    return { suit, value, position: pos };
  }

  private getSuitSymbol(suit: Suit): string {
    return {
      hearts: "♥",
      diamonds: "♦",
      clubs: "♣",
      spades: "♠",
    }[suit];
  }

  public isValidPosition(pos: Position): boolean {
    const [x, y] = pos;
    return (
      x >= 0 && x < GameBoard.BOARD_SIZE && y >= 0 && y < GameBoard.BOARD_SIZE
    );
  }

  private renderCell(cell: BoardCell, pos: Position): HTMLElement {
    const cellDiv = document.createElement("div");
    cellDiv.className = "board-cell";
    cellDiv.setAttribute("data-position", `${pos[0]},${pos[1]}`);

    if (cell.isCorner) {
      cellDiv.classList.add("corner");
      cellDiv.textContent = "★";
    } else if (cell.card) {
      cellDiv.classList.add("card");
      const symbol = this.getSuitSymbol(cell.card.suit);
      cellDiv.textContent = `${cell.card.value}${symbol}`;
    }

    if (cell.chip) {
      const chip = document.createElement("div");
      chip.className = `chip ${cell.chip}`;
      cellDiv.appendChild(chip);
    }

    return cellDiv;
  }

  public render(): void {
    this.element.innerHTML = "";
    this.element.appendChild(this.createBoardElement());
    this.addStyles();
  }

  private addStyles(): void {
    const style = document.createElement("style");
    style.textContent = `
            .game-board {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 2px;
                background: #2f3542;
                padding: 4px;
                border-radius: 8px;
                width: min(90vw, 90vh);
                aspect-ratio: 1;
                margin: 0 auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .board-cell {
                background: white;
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: clamp(0.8rem, 1.5vw, 1.2rem);
                position: relative;
                border-radius: 4px;
                user-select: none;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .board-cell:hover {
                background: #f5f6fa;
            }

            .corner {
                background: #ffd700;
                font-size: 1.5em;
            }

            .corner:hover {
                background: #ffd700;
                cursor: not-allowed;
            }

            .chip {
                position: absolute;
                inset: 10%;
                border-radius: 50%;
                border: 2px solid rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease;
            }

            .chip.player1 {
                background: #e74c3c;
                box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
            }

            .chip.player2 {
                background: #3498db;
                box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
            }

            .sequence {
                animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
    document.head.appendChild(style);
  }

  private createBoardElement(): HTMLElement {
    const boardDiv = document.createElement("div");
    boardDiv.className = "game-board";

    // Create cells for the 10x10 board
    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        boardDiv.appendChild(this.renderCell(cell, [i, j]));
      });
    });

    return boardDiv;
  }

  public addEventListener(
    event: string,
    handler: (e: CustomEvent) => void,
  ): void {
    this.element.addEventListener(event, handler as EventListener);
  }
}
