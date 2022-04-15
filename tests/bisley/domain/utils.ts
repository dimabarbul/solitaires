import CardSuit from '../../../src/shared-kernel/CardSuit';
import CardValue from '../../../src/shared-kernel/CardValue';
import Card, { areCardsEqual } from '../../../src/shared-kernel/Card';
import Deck from '../../../src/shared-kernel/Deck';

let cardId = 1;

export function getRandomSuit(): CardSuit {
    return getRandomElement([CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Clubs, CardSuit.Spades]);
}

export function getAnotherRandomSuit(existingSuit: CardSuit): CardSuit {
    let suit: CardSuit;

    do {
        suit = getRandomSuit();
    } while (suit === existingSuit);

    return suit;
}

export function getRandomValue(): CardValue {
    return getRandomElement([
        CardValue.Ace, CardValue.Two, CardValue.Three,
        CardValue.Four, CardValue.Five, CardValue.Six,
        CardValue.Seven, CardValue.Eight, CardValue.Nine,
        CardValue.Ten, CardValue.Jack, CardValue.Queen, CardValue.King,
    ]);
}

export function getRandomElement<TElement>(array: TElement[]): TElement {
    const randomIndex = getRandomNumber(0, array.length - 1);

    return array[randomIndex];
}

export function getRandomCard(): Card {
    return new Card(cardId++, getRandomSuit(), getRandomValue());
}

export function getAnotherRandomCard(existingCard: Card): Card {
    let card: Card;

    do {
        card = getRandomCard();
    } while (areCardsEqual(card, existingCard));

    return card;
}

export function getRandomCardValueNotAce(): CardValue {
    return getRandomElement([
        CardValue.Two, CardValue.Three, CardValue.Four,
        CardValue.Five, CardValue.Six, CardValue.Seven,
        CardValue.Eight, CardValue.Nine, CardValue.Ten,
        CardValue.Jack, CardValue.Queen, CardValue.King,
    ]);
}

export function getRandomCardNotAce(): Card {
    return new Card(cardId++, getRandomSuit(), getRandomCardValueNotAce());
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class DeckBuilder {

    private readonly _cards: Card[] = Deck.getFullDeck().cards;

    public constructor() {
        this.moveCard(CardSuit.Diamonds, CardValue.Ace, 48);
        this.moveCard(CardSuit.Hearts, CardValue.Ace, 49);
        this.moveCard(CardSuit.Clubs, CardValue.Ace, 50);
        this.moveCard(CardSuit.Spades, CardValue.Ace, 51);
    }

    public build(): Deck {
        return new Deck(this._cards, false);
    }

    public withAvailableCardInColumn(suit: CardSuit, value: CardValue, columnNumber: number): this {
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + this.getColumnLength(columnNumber) - 1);

        return this;
    }

    public withCardInColumnAt(suit: CardSuit, value: CardValue, columnNumber: number, number: number): this {
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + number);

        return this;
    }

    public withUnavailableCard(suit: CardSuit, value: CardValue): this {
        return this.withUnavailableCardInColumn(suit, value, getRandomNumber(0, 12));
    }

    public withUnavailableCardInColumn(suit: CardSuit, value: CardValue, columnNumber: number): this {
        const cardNumber = getRandomNumber(0, this.getColumnLength(columnNumber) - 2);
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + cardNumber);

        return this;
    }

    public withAvailableCard(suit: CardSuit, value: CardValue): this {
        const columnNumber = getRandomNumber(0, 13);
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + this.getColumnLength(columnNumber) - 1);

        return this;
    }

    private moveCard(suit: CardSuit, value: CardValue, toNumber: number): void {
        const cardNumber = this.findCard(suit, value);

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

    private findCard(suit: CardSuit, value: CardValue): number {
        const index = this._cards
            .findIndex(c => c.suit === suit && c.value === value);

        if (index === -1) {
            throw new Error(`Card with suit ${suit} and value ${value} not found`);
        }

        return index;
    }
}
