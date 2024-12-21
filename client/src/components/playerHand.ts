
import type { Card, Suit } from '../types';

interface HandState {
    cards: Card[];
    selectedCardIndex: number | null;
    playerId: string;
}

type HandConfig = {
    containerId: string;
    maxCards: number;
    onCardSelect: (card: Card) => void;
}

export class PlayerHand {
    private state: HandState;
    private element: HTMLElement;
    private config: HandConfig;

    constructor(config: HandConfig) {
        this.config = config;
        this.state = {
            cards: [],
            selectedCardIndex: null,
            playerId: 'Player'
        };
        
        const container = document.getElementById(config.containerId);
        if (!container) throw new Error(`Container ${config.containerId} not found`);
        
        this.element = this.createHandElement();
        container.appendChild(this.element);
        this.addStyles();
    }

    private createHandElement(): HTMLElement {
        const hand = document.createElement('div');
        hand.className = 'player-hand';
        return hand;
    }

    private getSuitSymbol(suit: Suit): string {
        return {
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣',
            spades: '♠'
        }[suit];
    }

    private createCardElement(card: Card, index: number): HTMLElement {
        const cardElement = document.createElement('button');
        cardElement.className = 'card-button';
        
        // Apply color based on suit (♥♦ = red, ♣♠ = black)
        const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
        cardElement.classList.add(isRed ? 'red-suit' : 'black-suit');
        
        // Create card content
        const content = document.createElement('div');
        content.className = 'card-content';
        
        const value = document.createElement('div');
        value.className = 'card-value';
        value.textContent = card.value;
        
        const suit = document.createElement('div');
        suit.className = 'card-suit';
        suit.textContent = this.getSuitSymbol(card.suit);
        
        content.appendChild(value);
        content.appendChild(suit);
        cardElement.appendChild(content);
        
        // Add click handler
        cardElement.addEventListener('click', () => {
            this.handleCardSelect(index);
        });
        
        return cardElement;
    }

    private handleCardSelect(index: number): void {
        // Update selection state
        if (this.state.selectedCardIndex === index) {
            this.state.selectedCardIndex = null;
        } else {
            this.state.selectedCardIndex = index;
        }
        
        // Notify parent component
        const selectedCard = this.state.cards[index];
        if (selectedCard) {
            this.config.onCardSelect(selectedCard);
        }
        
        this.render();
    }

    private addStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .player-hand {
                position: fixed;
                bottom: 16px;
                left: 50%;
                transform: translateX(-50%);
                padding: 16px;
                background: white;
                border-radius: 8px 8px 0 0;
                box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
                display: flex;
                gap: 8px;
                z-index: 1000;
            }
            
            .card-button {
                width: 64px;
                height: 96px;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 4px;
            }
            
            .card-button:hover {
                border-color: #3b82f6;
                transform: translateY(-4px);
            }
            
            .card-button.selected {
                border-color: #2563eb;
                background: #eff6ff;
            }
            
            .card-content {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .card-value {
                font-size: 1.25rem;
                font-weight: bold;
                line-height: 1;
            }
            
            .card-suit {
                font-size: 1.5rem;
                line-height: 1;
                margin-top: 4px;
            }
            
            .red-suit {
                color: #ef4444;
            }
            
            .black-suit {
                color: #1f2937;
            }
        `;
        document.head.appendChild(style);
    }

    public setCards(cards: Card[]): void {
        if (cards.length > this.config.maxCards) {
            throw new Error(`Cannot set more than ${this.config.maxCards} cards`);
        }
        this.state.cards = cards;
        this.render();
    }

    public setPlayerId(id: string): void {
        this.state.playerId = id;
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';
        
        // Create label
        const label = document.createElement('div');
        label.className = 'hand-label';
        label.textContent = `${this.state.playerId}'s Hand`;
        this.element.appendChild(label);
        
        // Create card elements
        this.state.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            if (this.state.selectedCardIndex === index) {
                cardElement.classList.add('selected');
            }
            this.element.appendChild(cardElement);
        });
    }
}
