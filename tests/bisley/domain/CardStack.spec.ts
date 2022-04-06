import CardStack from '../../../src/bisley/domain/CardStack';
import * as assert from 'assert';
import Card from '../../../src/core/Card';
import { getAnotherRandomCard, getRandomCard } from './utils';

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
            assert.strictEqual(stack.isCardAvailable(getRandomCard()), false);
        });
        it('false when card is not in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);
            assert.strictEqual(stack.isCardAvailable(getAnotherRandomCard(card)), false);
        });
        it('false when card is not top one', () => {
            const card: Card = getRandomCard();
            const anotherCard: Card = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);
            assert.strictEqual(stack.isCardAvailable(card), false);
        });
        it('true when card is the only one in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);
            assert.strictEqual(stack.isCardAvailable(card), true);
        });
        it('true when card is top one', () => {
            const card: Card = getRandomCard();
            const anotherCard: Card = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);
            assert.strictEqual(stack.isCardAvailable(anotherCard), true);
        });
    });
    describe('pop', () => {
        it('throws when stack is empty', () => {
            const stack: CardStack = new TestCardStack([]);
            assert.throws(() => stack.pop());
        });
        it('returns top card', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);
            assert.strictEqual(stack.pop(), card);
        });
    });
    describe('push', () => {
        it('throws when canPush returns false', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card], false);
            assert.throws(() => stack.push(card));
        });
        it('pushes card when canPush returns true', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card], true);
            stack.push(card);
            assert.strictEqual(stack.pop(), card);
        });
    });
    describe('findCardIndex', () => {
        it('returns null when card is not in stack', () => {
            const card = getRandomCard();
            const stack: CardStack = new TestCardStack([card]);
            assert.strictEqual(stack.findCardIndex(getAnotherRandomCard(card)), null);
        });
        it('returns index of card when card is in stack', () => {
            const card = getRandomCard();
            const anotherCard = getAnotherRandomCard(card);
            const stack: CardStack = new TestCardStack([card, anotherCard]);
            assert.strictEqual(stack.findCardIndex(card), 0);
            assert.strictEqual(stack.findCardIndex(anotherCard), 1);
        });
    });
});
