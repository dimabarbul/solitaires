import Card from './Card';
import CardSuit from './CardSuit';
import CardValue from './CardValue';

export default class Deck {
    private readonly _cards: Card[];
    private static readonly _suits: CardSuit[] = [CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades];
    private static readonly _fullDeckValues: CardValue[] = [
        CardValue.Ace, CardValue.Two, CardValue.Three,
        CardValue.Four, CardValue.Five, CardValue.Six,
        CardValue.Seven, CardValue.Eight, CardValue.Nine,
        CardValue.Ten, CardValue.Jack, CardValue.Queen,
        CardValue.King];
    private static readonly _shortDeckValues: CardValue[] = [
        CardValue.Ace, CardValue.Six, CardValue.Seven,
        CardValue.Eight, CardValue.Nine, CardValue.Ten,
        CardValue.Jack, CardValue.Queen, CardValue.King];
    private static readonly _shortDeckValuesInReverse: CardValue[] = Deck._shortDeckValues.reverse();

    public static getFullDeck(): Deck {
        return new Deck(Deck._fullDeckValues.length);
    }

    public static getShortDeck(): Deck {
        return new Deck(Deck._shortDeckValues.length);
    }

    public static getShortDeckInReverseOrder(): Deck {
        return new Deck(Deck._shortDeckValuesInReverse.length, false);
    }

    private constructor(cardCount: number, shuffle: boolean = true) {
        this._cards = [];
        if (cardCount === Deck._shortDeckValues.length) {
            this.fill(Deck._shortDeckValues);
        } else if (cardCount === Deck._fullDeckValues.length) {
            this.fill(Deck._fullDeckValues);
        } else {
            throw new Error(`Unexpected number of cards: ${cardCount}`);
        }

        if (shuffle) {
            this.shuffle();
        }
    }

    public get cards(): Card[] {
        return this._cards;
    }

    private fill(values: CardValue[]): void {
        for (let suit of Deck._suits) {
            for (let value of values) {
                this._cards.push(new Card(suit, value));
            }
        }
    }

    shuffle() {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }
}
