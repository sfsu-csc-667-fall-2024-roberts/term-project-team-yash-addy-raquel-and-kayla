import type { Card, Suit } from './types';

export class Deck {
    private cards: Card[];
    
    constructor() {
        this.cards = this.initializeDeck();
    }
    
    private initializeDeck(): Card[] {
        const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck: Card[] = [];
        
        // Create two of each card (Sequence rules require two decks)
        for (let i = 0; i < 2; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    deck.push({ suit, value });
                }
            }
        }
        
        return deck;
    }
    
    public shuffle(): void {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    public deal(numCards: number): Card[] {
        if (numCards > this.cards.length) {
            throw new Error('Not enough cards in deck');
        }
        return this.cards.splice(0, numCards);
    }
    
    public getCardsRemaining(): number {
        return this.cards.length;
    }
}
