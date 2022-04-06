import * as assert from 'assert';
import Column from '../../../src/bisley/domain/Column';
import { getAnotherRandomSuit, getRandomCard, getRandomSuit } from './utils';
import CardValue from '../../../src/core/CardValue';
import Card from '../../../src/core/Card';

describe('column', () => {
    describe('canPush', () => {
        it('true for next card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);
            assert.strictEqual(column.canPush(new Card(suit, CardValue.Five)), true);
        });
        it('true for previous card of same suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);
            assert.strictEqual(column.canPush(new Card(suit, CardValue.Three)), true);
        });
        it('false for next card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);
            assert.strictEqual(column.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Five)), false);
        });
        it('false for previous card of different suit', () => {
            const suit = getRandomSuit();
            const card = new Card(suit, CardValue.Four);
            const column = new Column([card]);
            assert.strictEqual(column.canPush(new Card(getAnotherRandomSuit(suit), CardValue.Three)), false);
        });
        it('false for empty column', () => {
            const column = new Column([]);
            assert.strictEqual(column.canPush(getRandomCard()), false);
        });
    });
});
