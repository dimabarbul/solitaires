import Column from '../../../src/bisley/domain/Column';
import { getAnotherRandomSuit, getRandomCard, getRandomSuit } from './utils';
import CardValue from '../../../src/core/CardValue';
import Card from '../../../src/core/Card';
import { expect } from 'chai';

describe('column', () => {
    describe('canPush', () => {
        it('true for next card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);

            expect(column.canPush(new Card(suit, CardValue.Five))).to.be.true;
        });
        it('true for previous card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);

            expect(column.canPush(new Card(suit, CardValue.Three))).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);

            expect(column.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Five))).to.be.false;
        });
        it('false for previous card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);

            expect(column.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Three))).to.be.false;
        });
        it('false for empty column', () => {
            const column = new Column([]);

            expect(column.canPush(getRandomCard())).to.be.false;
        });
    });
});
