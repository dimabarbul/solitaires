import CardStack from '../../shared-kernel/CardStack';
import CardStackType from './CardStackType';
import Card from '../../shared-kernel/Card';
import { getShortDeckDifference } from '../../shared-kernel/CardValue';

export default class Row extends CardStack<CardStackType> {
    public constructor(id: number, cards: readonly Card[]) {
        super(id, CardStackType.Row, cards);
    }

    public canPush(card: Card): boolean {
        if (this.isEmpty) {
            return true;
        }

        const topCard: Card = this.topCard;

        return getShortDeckDifference(card.value, topCard.value) === -1;
    }
}