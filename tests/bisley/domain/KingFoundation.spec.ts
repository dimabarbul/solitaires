import KingFoundation from '../../../src/bisley/domain/KingFoundation';
import { getAnotherRandomSuit, getRandomSuit } from './utils';
import Card from '../../../src/core/Card';
import CardValue from '../../../src/core/CardValue';
import { expect } from 'chai';

describe('king foundation', () => {
    describe('canPush', () => {
        it('true for king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            expect(foundation.canPush(new Card(suit, CardValue.King))).to.be.true;
        });
        it('false for king of different suit', () => {
            const suit = getRandomSuit();
            const anotherSuit = getAnotherRandomSuit(suit);
            const foundation = new KingFoundation(suit);
            expect(foundation.canPush(new Card(anotherSuit, CardValue.King))).to.be.false;
        });
        it('false for not king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            expect(foundation.canPush(new Card(suit, CardValue.Queen))).to.be.false;
        });
        it('true for next card when foundation contains some cards', () => {
            const suit = getRandomSuit();
            const foundation = new KingFoundation(suit);
            foundation.push(new Card(suit, CardValue.King));
            foundation.push(new Card(suit, CardValue.Queen));
            expect(foundation.canPush(new Card(suit, CardValue.Jack))).to.be.true;
        });
    });
});
