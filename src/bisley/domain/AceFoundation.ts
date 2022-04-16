import CardSuit from '../../shared/domain/CardSuit';
import Card from '../../shared/domain/Card';
import CardStack from '../../shared/domain/CardStack';
import CardStackType from './CardStackType';
import { CardExtensions } from './CardExtensions';

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
            && CardExtensions.getCardValueDifference(card.value, this.topCard.value) === 1;
    }
}