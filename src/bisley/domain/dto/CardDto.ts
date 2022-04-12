import CardSuit, { suitToString } from '../../../core/CardSuit';
import CardValue, { valueToString } from '../../../core/CardValue';

export default class CardDto {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue,
        public readonly isInteractable: boolean
    ) {
    }

    public toString(): string {
        return `${valueToString(this.value)}-${suitToString(this.suit)}`;
    }
}