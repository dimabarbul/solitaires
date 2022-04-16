import AceFoundation from '../../../src/bisley/domain/AceFoundation';
import Card from '../../../src/shared/domain/Card';
import { random } from '../../utils';
import CardSuit from '../../../src/shared/domain/CardSuit';
import CardValue from '../../../src/shared/domain/CardValue';
import { expect } from 'chai';

let foundationId = 1;
let cardId = 1;

describe('ace foundation', () => {
    describe('creation', () => {
        it('cannot create with not ace', () => {
            const suit: CardSuit = random.getRandomSuit();
            expect(() => {
                new AceFoundation(foundationId++, suit, random.getRandomCardNotAce());
            }).to.throw;
        });
    });
    describe('canPush', () => {
        it('true for next card of same suit on new foundation', () => {
            const suit: CardSuit = random.getRandomSuit();
            const foundation = createAceFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Two))).to.be.true;
        });
        it('false for not next card of same suit on new foundation', () => {
            const suit: CardSuit = random.getRandomSuit();
            const foundation = createAceFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Three))).to.be.false;
        });
        it('true for next card of same suit when foundation contains some cards', () => {
            const suit: CardSuit = random.getRandomSuit();
            const foundation = createAceFoundation(suit);
            foundation.push(new Card(cardId++, suit, CardValue.Two));
            foundation.push(new Card(cardId++, suit, CardValue.Three));
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Four))).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit: CardSuit = random.getRandomSuit();
            const foundation = createAceFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, random.getAnotherRandomSuit(suit), CardValue.Two))).to.be.false;
        });
        it('false for not next card of same suit', () => {
            const suit: CardSuit = random.getRandomSuit();
            const foundation = createAceFoundation(suit);
            expect(foundation.canPush(new Card(cardId++, suit, CardValue.Three))).to.be.false;
        });
    });
});

function createAceFoundation(suit: CardSuit): AceFoundation {
    return new AceFoundation(foundationId++, suit, new Card(cardId++, suit, CardValue.Ace));
}
