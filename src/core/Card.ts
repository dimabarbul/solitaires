import CardSuit, { suitToString } from './CardSuit';
import CardValue, { valueToString } from './CardValue';

export default class Card {
    constructor(
        private readonly _suit: CardSuit,
        private readonly _value: CardValue
    ) {
    }

    get suit(): CardSuit {
        return this._suit;
    }

    get value(): CardValue {
        return this._value;
    }

    public toString(): string {
        return `${valueToString(this.value)}${suitToString(this._suit)}`;
    }
}

export function areCardsEqual(left: Card, right: Card) {
    return left.value === right.value && left.suit === right.suit;
}
