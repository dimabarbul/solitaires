import CardSuit from '../../../core/CardSuit';
import CardValue from '../../../core/CardValue';

export default class CardDto {
    public constructor(
        public readonly id: number,
        public readonly suit: CardSuit,
        public readonly value: CardValue,
        public readonly isInteractable: boolean
    ) {
    }
}