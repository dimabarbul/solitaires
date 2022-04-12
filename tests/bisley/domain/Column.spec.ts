import Column from '../../../src/bisley/domain/Column';
import { getAnotherRandomSuit, getRandomCard, getRandomSuit } from './utils';
import CardValue from '../../../src/core/CardValue';
import Card from '../../../src/core/Card';
import { expect } from 'chai';

let columnId = 1;
let cardId = 1;

describe('column', () => {
    describe('canPush', () => {
        it('true for next card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, suit, CardValue.Five))).to.be.true;
        });
        it('true for previous card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, suit, CardValue.Three))).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, getAnotherRandomSuit(suit), CardValue.Five))).to.be.false;
        });
        it('false for previous card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, getAnotherRandomSuit(suit), CardValue.Three))).to.be.false;
        });
        it('false for empty column', () => {
            const column = new Column(columnId++, []);

            expect(column.canPush(getRandomCard())).to.be.false;
        });
    });
});
