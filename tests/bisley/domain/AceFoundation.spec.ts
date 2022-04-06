import AceFoundation from '../../../src/bisley/domain/AceFoundation';
import Card, { areCardsEqual } from '../../../src/core/Card';
import { getAnotherRandomSuit, getRandomSuit } from './utils';
import CardSuit from '../../../src/core/CardSuit';
import * as assert from 'assert';
import CardValue from '../../../src/core/CardValue';

describe('ace foundation', () => {
    it('new foundation contains ace', () => {
        const suit: CardSuit = getRandomSuit();
        const foundation = new AceFoundation(suit);
        const card: Card = foundation.pop();
        assert.ok(areCardsEqual(card, new Card(suit, CardValue.Ace)));
    });
    describe('canPush', () => {
        it('true for next card of same suit on new foundation', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            assert.equal(foundation.canPush(new Card(suit, CardValue.Two)), true);
        });
        it('true for next card of same suit when foundation contains some cards', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            foundation.push(new Card(suit, CardValue.Two));
            foundation.push(new Card(suit, CardValue.Three));
            assert.equal(foundation.canPush(new Card(suit, CardValue.Four)), true);
        });
        it('false for next card of different suit', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            assert.equal(foundation.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Two)), false);
        });
        it('false for not next card of same suit', () => {
            const suit: CardSuit = getRandomSuit();
            const foundation = new AceFoundation(suit);
            assert.equal(foundation.canPush(new Card(suit, CardValue.Three)), false);
        });
    });
});