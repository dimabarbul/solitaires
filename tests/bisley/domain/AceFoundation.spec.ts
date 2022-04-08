import AceFoundation from '../../../src/bisley/domain/AceFoundation';
import Card, { areCardsEqual } from '../../../src/core/Card';
import { getAnotherRandomSuit, getRandomSuit } from './utils';
import CardSuit from '../../../src/core/CardSuit';
import CardValue from '../../../src/core/CardValue';
import { expect } from 'chai';

describe('ace foundation', () => {
    it('new foundation contains ace', () => {
        const suit: CardSuit = getRandomSuit();
        const foundation = new AceFoundation(suit);
        const card: Card = foundation.pop();
        expect(areCardsEqual(card, new Card(suit, CardValue.Ace))).to.be.true;
    });
    describe('canPush', () => {
        it('true for next card of same suit on new foundation', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            expect(foundation.canPush(new Card(suit, CardValue.Two))).to.be.true;
        });
        it('true for next card of same suit when foundation contains some cards', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            foundation.push(new Card(suit, CardValue.Two));
            foundation.push(new Card(suit, CardValue.Three));
            expect(foundation.canPush(new Card(suit, CardValue.Four))).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            expect(foundation.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Two))).to.be.false;
        });
        it('false for not next card of same suit', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            expect(foundation.canPush(new Card(suit, CardValue.Three))).to.be.false;
        });
    });
});