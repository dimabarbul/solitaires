﻿import CardStack from '../../shared-kernel/CardStack';
import CardStackType from './CardStackType';
import Card from '../../shared-kernel/Card';
import CardValue from '../../shared-kernel/CardValue';
import CardSuit from '../../shared-kernel/CardSuit';
import { CardExtensions } from './CardExtensions';

export default class Foundation extends CardStack<CardStackType> {
    private readonly _suit: CardSuit;

    public constructor(id: number, ace: Card) {
        super(id, CardStackType.Foundation, [ace]);

        if (ace.value !== CardValue.Ace) {
            throw new Error('Ace card must be the first card in the foundation');
        }

        this._suit = ace.suit;
    }

    public get suit(): CardSuit {
        return this._suit;
    }

    public canPush(card: Card): boolean {
        const topCard = this.topCard;

        return topCard.suit === card.suit && CardExtensions.getCardValueDifference(card.value, topCard.value) === 1;
    }
}