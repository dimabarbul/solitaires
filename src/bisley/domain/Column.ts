import Card from '../../shared-kernel/Card';
import CardStack from '../../shared-kernel/CardStack';
import { getFullDeckDifference } from '../../shared-kernel/CardValue';
import CardStackType from './CardStackType';

export default class Column extends CardStack<CardStackType> {
    public constructor(id: number, cards: Card[]) {
        super(id, CardStackType.Column, cards);
    }

    public canPush(card: Card): boolean {
        if (this.isEmpty) {
            return false;
        }

        const topCard = this.topCard;

        return topCard.suit === card.suit
            && Math.abs(getFullDeckDifference(card.value, topCard.value)) === 1;
    }
}