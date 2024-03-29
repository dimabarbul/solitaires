﻿import CardStack from '../../shared/domain/CardStack';
import CardStackType from './CardStackType';
import Card from '../../shared/domain/Card';
import CardValue from '../../shared/domain/CardValue';
import CardSuit from '../../shared/domain/CardSuit';
import { CardExtensions } from './CardExtensions';

export default class Foundation extends CardStack<CardStackType> {
    private readonly suit: CardSuit;

    public constructor(id: number, ace: Card) {
        super(id, CardStackType.Foundation, [ace]);

        if (ace.value !== CardValue.Ace) {
            throw new Error('Ace card must be the first card in the foundation');
        }

        this.suit = ace.suit;
    }

    public canPush(card: Card): boolean {
        const topCard = this.topCard;

        return topCard.suit === card.suit && CardExtensions.getCardValueDifference(card.value, topCard.value) === 1;
    }

    public isCardAvailable(_: number): boolean {
        return false;
    }
}
