import CardSuit from '../CardSuit';
import CardValue from '../CardValue';

export default class CardDto {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue,
        public readonly isInteractable: boolean
    ) {
    }
}