import CardSuit from '../../shared/domain/CardSuit';
import Card from '../../shared/domain/Card';
import CardStack from '../../shared/domain/CardStack';
import CardValue from '../../shared/domain/CardValue';
import CardStackType from './CardStackType';
import { CardExtensions } from './CardExtensions';

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

        return CardExtensions.getCardValueDifference(card.value, this.topCard.value) === -1;
    }

    public isCardAvailable(_: number): boolean {
        return false;
    }
}