import Column from '../../../src/bisley/domain/Column';
import { random } from '../../utils';
import CardValue from '../../../src/shared/domain/CardValue';
import Card from '../../../src/shared/domain/Card';
import { expect } from 'chai';

let columnId = 1;
let cardId = 1;

describe('column', () => {
    describe('canPush', () => {
        it('true for next card of same suit', () => {
            const suit = random.getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, suit, CardValue.Five))).to.be.true;
        });
        it('true for previous card of same suit', () => {
            const suit = random.getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, suit, CardValue.Three))).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit = random.getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, random.getAnotherRandomSuit(suit), CardValue.Five))).to.be.false;
        });
        it('false for previous card of different suit', () => {
            const suit = random.getRandomSuit();
            const card = new Card(cardId++, suit, CardValue.Four);
            const column = new Column(columnId++, [card]);

            expect(column.canPush(new Card(cardId++, random.getAnotherRandomSuit(suit), CardValue.Three))).to.be.false;
        });
        it('false for empty column', () => {
            const column = new Column(columnId++, []);

            expect(column.canPush(random.getRandomCard())).to.be.false;
        });
    });
});
