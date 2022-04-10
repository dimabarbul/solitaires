import CardSuit from '../../core/CardSuit';
import Card from '../../core/Card';
import CardStack from './CardStack';
import CardValue, { getFullDeckDifference } from '../../core/CardValue';
import CardStackType from './CardStackType';

export default class KingFoundation extends CardStack<CardStackType> {
    public constructor(
        id: number,
        public readonly suit: CardSuit
    ) {
        super(id, CardStackType.KingFoundation, []);
    }

    public canPush(card: Card): boolean {
        if (this.suit !== card.suit) {
            return false;
        }

        if (this.isEmpty) {
            return card.value === CardValue.King;
        }

        return getFullDeckDifference(card.value, this.topCard.value) === -1;
    }

    public isCardAvailable(_: number): boolean {
        return false;
    }
}