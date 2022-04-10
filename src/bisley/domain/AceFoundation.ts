import CardSuit from '../../core/CardSuit';
import Card from '../../core/Card';
import CardStack from './CardStack';
import { getFullDeckDifference } from '../../core/CardValue';
import CardStackType from './CardStackType';

export default class AceFoundation extends CardStack<CardStackType> {
    public constructor(
        id: number,
        private readonly _suit: CardSuit,
        ace: Card
    ) {
        super(id, CardStackType.AceFoundation, [ace]);
    }

    public get suit(): CardSuit {
        return this._suit;
    }

    public isCardAvailable(_: number): boolean {
        return false;
    }

    public canPush(card: Card): boolean {
        return this._suit === card.suit
            && getFullDeckDifference(card.value, this.topCard.value) === 1;
    }
}