import CardSuit, { suitFromString, suitToString } from '../../../core/CardSuit';
import CardValue, { valueFromString, valueToString } from '../../../core/CardValue';
import Card from '../../../core/Card';

export default class CardDto {
    constructor(
        private readonly _suit: CardSuit,
        private readonly _value: CardValue
    ) {
    }

    public static fromString(cardString: string): CardDto {
        const [value, suit] = cardString.split('-');
        return new CardDto(suitFromString(suit), valueFromString(value));
    }

    public static fromCard(card: Card): CardDto {
        return new CardDto(card.suit, card.value);
    }

    get suit(): CardSuit {
        return this._suit;
    }

    get value(): CardValue {
        return this._value;
    }

    public equalsTo(card: CardDto): boolean {
        return this._suit === card.suit && this._value === card.value;
    }

    public toString(): string {
        return `${valueToString(this.value)}-${suitToString(this.suit)}`;
    }
}