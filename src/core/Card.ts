import CardSuit, { suitToString } from './CardSuit';
import CardValue, { valueToString } from './CardValue';

export default class Card {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue
    ) {
    }

    public toString(): string {
        return `${valueToString(this.value)}${suitToString(this.suit)}`;
    }
}

export function areCardsEqual(left: Card, right: Card): boolean {
    return left.value === right.value && left.suit === right.suit;
}
