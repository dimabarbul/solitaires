import CardSuit from '../../core/CardSuit';
import Card from '../../core/Card';
import CardStack from './CardStack';
import CardValue, { getFullDeckDifference } from '../../core/CardValue';

export default class AceFoundation extends CardStack {
    public constructor(
        private readonly _suit: CardSuit
    ) {
        super([new Card(_suit, CardValue.Ace)]);
    }

    public get suit(): CardSuit {
        return this._suit;
    }

    public isCardAvailable(_: Card): boolean {
        return false;
    }

    public canPush(card: Card): boolean {
        return this._suit === card.suit
            && getFullDeckDifference(card.value, this.topCard.value) === 1;
    }
}