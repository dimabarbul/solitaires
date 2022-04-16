import Card from '../../shared/domain/Card';
import CardStack from '../../shared/domain/CardStack';
import CardStackType from './CardStackType';
import { CardExtensions } from './CardExtensions';

export default class Column extends CardStack<CardStackType> {
    public constructor(id: number, cards: readonly Card[]) {
        super(id, CardStackType.Column, cards);
    }

    public canPush(card: Card): boolean {
        if (this.isEmpty) {
            return false;
        }

        const topCard = this.topCard;

        return topCard.suit === card.suit
            && Math.abs(CardExtensions.getCardValueDifference(card.value, topCard.value)) === 1;
    }
}