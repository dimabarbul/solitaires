import Card from '../../core/Card';
import CardStack from './CardStack';
import { getFullDeckDifference } from '../../core/CardValue';

export default class Column extends CardStack{
    public constructor(cards: Card[]) {
        super(cards);
    }

    public canPush(card: Card): boolean {
        if (this.isEmpty()) {
            return false;
        }

        const topCard = this.topCard;

        return topCard.suit === card.suit
            && Math.abs(getFullDeckDifference(card.value, topCard.value)) === 1;
    }
}