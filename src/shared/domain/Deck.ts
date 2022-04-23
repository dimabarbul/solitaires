import Card from './Card';
import CardSuit from './CardSuit';
import CardValue from './CardValue';

export default class Deck {
    private static readonly suits: CardSuit[] = [CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades];
    private static readonly fullDeckValues: CardValue[] = [
        CardValue.Ace, CardValue.Two, CardValue.Three,
        CardValue.Four, CardValue.Five, CardValue.Six,
        CardValue.Seven, CardValue.Eight, CardValue.Nine,
        CardValue.Ten, CardValue.Jack, CardValue.Queen,
        CardValue.King];
    private static readonly shortDeckValues: CardValue[] = [
        CardValue.Ace, CardValue.Six, CardValue.Seven,
        CardValue.Eight, CardValue.Nine, CardValue.Ten,
        CardValue.Jack, CardValue.Queen, CardValue.King];
    private static readonly shortDeckValuesInReverse: CardValue[] = Deck.shortDeckValues.reverse();
    private static readonly fullDeckValuesInReverse: CardValue[] = Deck.fullDeckValues.reverse();

    public readonly cards: Card[];

    public constructor(cards: readonly Card[], shuffle: boolean = true) {
        this.cards = cards.slice(0, cards.length);

        if (shuffle) {
            this.shuffle();
        }
    }

    public static getFullDeck(): Deck {
        return new Deck(Deck.createCards(Deck.fullDeckValues));
    }

    public static getShortDeck(): Deck {
        return new Deck(Deck.createCards(Deck.shortDeckValues));
    }

    public static getFullDeckInReverseOrder(): Deck {
        return new Deck(Deck.createCards(Deck.fullDeckValuesInReverse), false);
    }

    public static getShortDeckInReverseOrder(): Deck {
        return new Deck(Deck.createCards(Deck.shortDeckValuesInReverse), false);
    }

    private static createCards(values: CardValue[]): Card[] {
        const cards: Card[] = [];
        let id: number = 1;

        for (const suit of Deck.suits) {
            for (const value of values) {
                cards.push(new Card(id++, suit, value));
            }
        }

        return cards;
    }

    public findCard(suit: CardSuit, value: CardValue): Card {
        return this.cards.find((card: Card) => card.suit === suit && card.value === value)
            ?? ((): never => {
                throw new Error(`Card with suit ${suit} and value ${value} not found in deck`);
            })();
    }

    private shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}
