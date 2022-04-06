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
        for (let suit of Deck._suits) {
            for (let value of values) {
                cards.push(new Card(suit, value));
            }
        }

        return cards;
    }

    public constructor(private readonly _cards: Card[], shuffle: boolean = true) {
        if (shuffle) {
            this.shuffle();
        }
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
