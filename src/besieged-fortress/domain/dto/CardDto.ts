import CardSuit, { suitFromString, suitToString } from '../../../shared-kernel/CardSuit';
import CardValue, { valueFromString, valueToString } from '../../../shared-kernel/CardValue';
import Card from '../../../shared-kernel/Card';

export default class CardDto {
    public constructor(
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

    public get suit(): CardSuit {
        return this._suit;
    }

    public get value(): CardValue {
        return this._value;
    }

    public equalsTo(card: CardDto): boolean {
        return this._suit === card.suit && this._value === card.value;
    }

    public toString(): string {
        return `${valueToString(this.value)}-${suitToString(this.suit)}`;
    }
}