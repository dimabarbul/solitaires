import CardSuit from '../../core/CardSuit';
import Card from '../../core/Card';
import CardStack from './CardStack';
import CardValue, { getFullDeckDifference } from '../../core/CardValue';

export default class AceFoundation extends CardStack {
    constructor(
        private readonly _suit: CardSuit
    ) {
        super([new Card(_suit, CardValue.Ace)]);
    }

    get suit(): CardSuit {
        return this._suit;
    }

    public isCardAvailable(card: Card): boolean {
        return false;
    }

    public canPush(card: Card): boolean {
        return this._suit === card.suit
            && getFullDeckDifference(card.value, this.topCard.value) === 1;
    }
}