import CardSuit from '../../core/CardSuit';
import Card from '../../core/Card';
import CardStack from './CardStack';
import CardValue, { getFullDeckDifference } from '../../core/CardValue';

export default class KingFoundation extends CardStack {
    public constructor(
        private readonly _suit: CardSuit
    ) {
        super([]);
    }

    public canPush(card: Card): boolean {
        if (this._suit !== card.suit) {
            return false;
        }

        if (this.isEmpty()) {
            return card.value === CardValue.King;
        }

        return getFullDeckDifference(card.value, this.topCard.value) === -1;
    }

    public isCardAvailable(_: Card): boolean {
        return false;
    }
}