import KingFoundation from '../../../src/bisley/domain/KingFoundation';
import { getAnotherRandomSuit, getRandomSuit } from './utils';
import Card from '../../../src/core/Card';
import CardValue from '../../../src/core/CardValue';
import { expect } from 'chai';
import CardSuit from '../../../src/core/CardSuit';

let foundationId = 1;
let cardId = 1;

describe('king foundation', () => {
    describe('canPush', () => {
        it('true for king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = createKingFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.King))).to.be.true;
        });
        it('false for king of different suit', () => {
            const suit = getRandomSuit();
            const anotherSuit = getAnotherRandomSuit(suit);
            const foundation = createKingFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, anotherSuit, CardValue.King))).to.be.false;
        });
        it('false for not king of same suit', () => {
            const suit = getRandomSuit();
            const foundation = createKingFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Queen))).to.be.false;
        });
        it('true for next card when foundation contains some cards', () => {
            const suit = getRandomSuit();
            const foundation = createKingFoundation(suit);
            foundation.push(new Card(cardId++, suit, CardValue.King));
            foundation.push(new Card(cardId++, suit, CardValue.Queen));
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Jack))).to.be.true;
        });
    });
});

function createKingFoundation(suit: CardSuit): KingFoundation {
    return new KingFoundation(foundationId++, suit);
}
