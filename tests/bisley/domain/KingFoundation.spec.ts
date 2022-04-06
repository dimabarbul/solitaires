import KingFoundation from '../../../src/bisley/domain/KingFoundation';
import { getAnotherRandomSuit, getRandomSuit } from './utils';
import * as assert from 'assert';
import Card from '../../../src/core/Card';
import CardValue from '../../../src/core/CardValue';

describe('king foundation', () => {
    describe('canPush', () => {
        it('true for king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            assert.strictEqual(foundation.canPush(new Card(suit, CardValue.King)), true);
        });
        it('false for king of different suit', () => {
            const suit = getRandomSuit();
            const anotherSuit = getAnotherRandomSuit(suit);
            const foundation = new KingFoundation(suit);
            assert.strictEqual(foundation.canPush(new Card(anotherSuit, CardValue.King)), false);
        });
        it('false for not king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            assert.strictEqual(foundation.canPush(new Card(suit, CardValue.Queen)), false);
        });
        it('true for next card when foundation contains some cards', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            foundation.push(new Card(suit, CardValue.King));
            foundation.push(new Card(suit, CardValue.Queen));
            assert.strictEqual(foundation.canPush(new Card(suit, CardValue.Jack)), true);
        });
    });
});
