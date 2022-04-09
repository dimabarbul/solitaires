import CardSuit, { suitToString } from './CardSuit';
import CardValue, { valueToString } from './CardValue';

export default class Card {
    public constructor(
        private readonly _suit: CardSuit,
        private readonly _value: CardValue
    ) {
    }

    public get suit(): CardSuit {
        return this._suit;
    }

    public get value(): CardValue {
        return this._value;
    }

    public toString(): string {
        return `${valueToString(this.value)}${suitToString(this._suit)}`;
    }
}

export function areCardsEqual(left: Card, right: Card): boolean {
    return left.value === right.value && left.suit === right.suit;
}
