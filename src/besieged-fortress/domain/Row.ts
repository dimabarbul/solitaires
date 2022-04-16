import CardStack from '../../shared-kernel/CardStack';
import CardStackType from './CardStackType';
import Card from '../../shared-kernel/Card';
import { CardExtensions } from './CardExtensions';

export default class Row extends CardStack<CardStackType> {
    public constructor(id: number, cards: readonly Card[]) {
        super(id, CardStackType.Row, cards);
    }

    public canPush(card: Card): boolean {
        if (this.isEmpty) {
            return true;
        }

        const topCard: Card = this.topCard;

        return CardExtensions.getCardValueDifference(card.value, topCard.value) === -1;
    }
}