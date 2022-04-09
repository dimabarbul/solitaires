import Card from './Card';
import CardSuit from './CardSuit';
import CardValue from './CardValue';

export default class Deck {
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

    private readonly _cards: Card[];

    public constructor(cards: Card[], shuffle: boolean = true) {
        this._cards = cards.slice(0, cards.length);

        if (shuffle) {
            this.shuffle();
        }
    }

    public static getFullDeck(): Deck {
        return new Deck(Deck.createCards(Deck._fullDeckValues));
    }

    public static getShortDeck(): Deck {
        return new Deck(Deck.createCards(Deck._shortDeckValues));
    }

    public static getShortDeckInReverseOrder(): Deck {
        return new Deck(Deck.createCards(Deck._shortDeckValuesInReverse), false);
    }

    private static createCards(values: CardValue[]): Card[] {
        const cards: Card[] = [];

        for (const suit of Deck._suits) {
            for (const value of values) {
                cards.push(new Card(suit, value));
            }
        }

        return cards;
    }

    public get cards(): Card[] {
        return this._cards;
    }

    private shuffle(): void {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }
}
