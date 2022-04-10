import Card from '../../core/Card';
import CardStack from './CardStack';
import { getFullDeckDifference } from '../../core/CardValue';
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