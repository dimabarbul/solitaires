import CardSuit, { suitToString } from '../../../core/CardSuit';
import CardValue, { valueToString } from '../../../core/CardValue';
// import Card from '../../../core/Card';

export default class CardDto {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue,
        public readonly canBeMoved: boolean
    ) {
    }

    // public static fromCard(card: Card): CardDto {
    //     return new CardDto(card.id, card.suit, card.value);
    // }

    // public equalsTo(card: CardDto): boolean {
    //     return this.suit === card.suit && this.value === card.value;
    // }

    public toString(): string {
        return `${valueToString(this.value)}-${suitToString(this.suit)}`;
    }
}