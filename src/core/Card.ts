import CardSuit from './CardSuit';
import CardValue from './CardValue';

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
}