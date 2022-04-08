import CardStack from '../../../src/bisley/domain/CardStack';
import Card, { areCardsEqual } from '../../../src/core/Card';
import { getAnotherRandomCard, getRandomCard } from './utils';
import { expect } from 'chai';

class TestCardStack extends CardStack {
    private readonly _canPush: boolean;

    constructor(cards: Card[], canPush: boolean = true) {
        super(cards);

        this._canPush = canPush;
    }

    public canPush(card: Card): boolean {
        return this._canPush;
    }
}

describe('card stack', () => {
    describe('is available card', () => {
        it('false for empty stack', () => {
            const stack: CardStack = new TestCardStack([]);

            expect(stack.isCardAvailable(getRandomCard())).to.be.false;
        });
        it('false when card is not in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);

            expect(stack.isCardAvailable(getAnotherRandomCard(card))).to.be.false;
        });
        it('false when card is not top one', () => {
            const card: Card = getRandomCard();
            const anotherCard: Card = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);

            expect(stack.isCardAvailable(card)).to.be.false;
        });
        it('true when card is the only one in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);

            expect(stack.isCardAvailable(card)).to.be.true;
        });
        it('true when card is top one', () => {
            const card: Card = getRandomCard();
            const anotherCard: Card = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);

            expect(stack.isCardAvailable(anotherCard)).to.be.true;
        });
    });
    describe('pop', () => {
        it('throws when stack is empty', () => {
            const stack: CardStack = new TestCardStack([]);

            expect((() => stack.pop())).to.throw;
        });
        it('returns top card', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);

            expect(areCardsEqual(stack.pop(), card)).to.be.true;
        });
    });
    describe('push', () => {
        it('throws when canPush returns false', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card], false);

            expect((() => stack.push(card))).to.throw;
        });
        it('pushes card when canPush returns true', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card], true);
            stack.push(card);

            expect(areCardsEqual(stack.pop(), card)).to.be.true;
        });
    });
    describe('findCardIndex', () => {
        it('returns null when card is not in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);

            expect(stack.findCardIndex(getAnotherRandomCard(card))).to.be.null;
        });
        it('returns index of card when card is in stack', () => {
            const card = getRandomCard();
            const anotherCard = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);

            expect(stack.findCardIndex(card)).to.equal(0);
            expect(stack.findCardIndex(anotherCard)).to.equal(1);
        });
    });
});
