import CardSuit from './CardSuit';
import CardValue from './CardValue';

export default class Card {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue
    ) {
    }

    public toString(): string {
        return `${CardValue[this.value]} of ${CardSuit[this.suit]}`;
    }
}
