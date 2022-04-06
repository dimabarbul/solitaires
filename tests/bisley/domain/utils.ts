import CardSuit from '../../../src/core/CardSuit';
import CardValue from '../../../src/core/CardValue';
import Card, { areCardsEqual } from '../../../src/core/Card';
import Deck from '../../../src/core/Deck';

export function getRandomSuit(): CardSuit {
    return getRandomElement([CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Clubs, CardSuit.Spades]);
}

export function getAnotherRandomSuit(existingSuit: CardSuit): CardSuit {
    let suit: CardSuit;
    do {
        suit = getRandomSuit();
    } while (suit == existingSuit);

    return suit;
}

export function getRandomValue(): CardValue {
    return getRandomElement([
        CardValue.Ace, CardValue.Two, CardValue.Three,
        CardValue.Four, CardValue.Five, CardValue.Six,
        CardValue.Seven, CardValue.Eight, CardValue.Nine,
        CardValue.Ten, CardValue.Jack, CardValue.Queen, CardValue.King
    ]);
}

export function getRandomElement<T>(array: T[]): T {
    const randomIndex = getRandomNumber(0, array.length - 1);
    return array[randomIndex];
}

export function getRandomCard(): Card {
    return new Card(getRandomSuit(), getRandomValue());
}

export function getAnotherRandomCard(existingCard: Card): Card {
    let card: Card;
    do {
        card = getRandomCard();
    } while (areCardsEqual(card, existingCard));

    return card;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class DeckBuilder {

    private readonly _cards: Card[] = Deck.getFullDeck().cards;

    constructor() {
        this.moveCard(new Card(CardSuit.Diamonds, CardValue.Ace), 48);
        this.moveCard(new Card(CardSuit.Hearts, CardValue.Ace), 49);
        this.moveCard(new Card(CardSuit.Clubs, CardValue.Ace), 50);
        this.moveCard(new Card(CardSuit.Spades, CardValue.Ace), 51);
    }

    public withAvailableCardInColumn(card: Card, columnNumber: number): DeckBuilder {
        this.moveCard(card, this.getColumnStartIndex(columnNumber) + this.getColumnLength(columnNumber) - 1);

        return this;
    }

    build(): Deck {
        return new Deck(this._cards, false);
    }

    withCardInColumnAt(card: Card, columnNumber: number, number: number): DeckBuilder {
        this.moveCard(card, this.getColumnStartIndex(columnNumber) + number);

        return this;
    }

    withAvailableCard(card: Card): DeckBuilder {
        const columnNumber = getRandomNumber(0, 13);
        this.moveCard(card, this.getColumnStartIndex(columnNumber) + this.getColumnLength(columnNumber) - 1);

        return this;
    }

    private moveCard(card: Card, toNumber: number): void {
        const cardNumber = this.findCard(card);
        if (cardNumber !== toNumber) {
            [this._cards[toNumber], this._cards[cardNumber]] = [this._cards[cardNumber], this._cards[toNumber]];
        }
    }

    private getColumnStartIndex(columnNumber: number): number {
        return columnNumber < 4 ?
            columnNumber * 3 :
            (columnNumber - 4) * 4 + 12;
    }

    private getColumnLength(columnNumber: number): number {
        return columnNumber < 4 ? 3 : 4;
    }

    private findCard(card: Card): number {
        return this._cards
            .findIndex(c => areCardsEqual(c, card));
    }
}
