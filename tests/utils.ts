import CardSuit from '../src/shared/domain/CardSuit';
import CardValue from '../src/shared/domain/CardValue';
import Card from '../src/shared/domain/Card';
import Deck from '../src/shared/domain/Deck';

let cardId = 1;

export const random = {
    getRandomSuit: (): CardSuit => {
        return random.getRandomElement([CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Clubs, CardSuit.Spades]);
    },

    getAnotherRandomSuit: (existingSuit: CardSuit): CardSuit => {
        let suit: CardSuit;

        do {
            suit = random.getRandomSuit();
        } while (suit === existingSuit);

        return suit;
    },

    getRandomValue: (): CardValue => {
        return random.getRandomElement([
            CardValue.Ace, CardValue.Two, CardValue.Three,
            CardValue.Four, CardValue.Five, CardValue.Six,
            CardValue.Seven, CardValue.Eight, CardValue.Nine,
            CardValue.Ten, CardValue.Jack, CardValue.Queen, CardValue.King,
        ]);
    },

    getRandomElement: <TElement>(array: TElement[]): TElement => {
        const randomIndex = random.getRandomNumber(0, array.length - 1);

        return array[randomIndex];
    },

    getRandomCard: (): Card => {
        return new Card(cardId++, random.getRandomSuit(), random.getRandomValue());
    },

    getAnotherRandomCard: (existingCard: Card): Card => {
        let card: Card;

        do {
            card = random.getRandomCard();
        } while (card.suit === existingCard.suit && card.value === existingCard.value);

        return card;
    },

    getRandomCardValueNotAce: (): CardValue => {
        return random.getRandomElement([
            CardValue.Two, CardValue.Three, CardValue.Four,
            CardValue.Five, CardValue.Six, CardValue.Seven,
            CardValue.Eight, CardValue.Nine, CardValue.Ten,
            CardValue.Jack, CardValue.Queen, CardValue.King,
        ]);
    },

    getRandomCardNotAce: (): Card => {
        return new Card(cardId++, random.getRandomSuit(), random.getRandomCardValueNotAce());
    },

    getRandomNumber: (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

export class DeckBuilder {
    private readonly cards: Card[] = Deck.getFullDeck().cards;

    public constructor() {
        this.moveCard(CardSuit.Diamonds, CardValue.Ace, 48);
        this.moveCard(CardSuit.Hearts, CardValue.Ace, 49);
        this.moveCard(CardSuit.Clubs, CardValue.Ace, 50);
        this.moveCard(CardSuit.Spades, CardValue.Ace, 51);
    }

    public build(): Deck {
        return new Deck(this.cards, false);
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
        return this.withUnavailableCardInColumn(suit, value, random.getRandomNumber(0, 12));
    }

    public withUnavailableCardInColumn(suit: CardSuit, value: CardValue, columnNumber: number): this {
        const cardNumber = random.getRandomNumber(0, this.getColumnLength(columnNumber) - 2);
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + cardNumber);

        return this;
    }

    public withAvailableCard(suit: CardSuit, value: CardValue): this {
        const columnNumber = random.getRandomNumber(0, 13);
        this.moveCard(suit, value, this.getColumnStartIndex(columnNumber) + this.getColumnLength(columnNumber) - 1);

        return this;
    }

    private moveCard(suit: CardSuit, value: CardValue, toNumber: number): void {
        const cardNumber = this.findCard(suit, value);

        if (cardNumber !== toNumber) {
            [this.cards[toNumber], this.cards[cardNumber]] = [this.cards[cardNumber], this.cards[toNumber]];
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
        const index = this.cards
            .findIndex(c => c.suit === suit && c.value === value);

        if (index === -1) {
            throw new Error(`Card with suit ${suit} and value ${value} not found`);
        }

        return index;
    }
}
