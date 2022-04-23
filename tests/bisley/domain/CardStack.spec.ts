import CardStack from '../../../src/shared/domain/CardStack';
import Card from '../../../src/shared/domain/Card';
import { random } from '../../utils';
import { expect } from 'chai';

enum CardStackType {
    Test = 1,
}

let stackId = 1;

class TestCardStack extends CardStack<CardStackType> {
    public constructor(
        cards: Card[],
        private readonly canPushAnyCard: boolean = true) {
        super(stackId++, CardStackType.Test, cards);
    }

    public canPush(_: Card): boolean {
        return this.canPushAnyCard;
    }
}

describe('card stack', () => {
    describe('is available card', () => {
        it('false for empty stack', () => {
            const stack = new TestCardStack([]);

            expect(stack.isCardAvailable(random.getRandomCard().id)).to.be.false;
        });
        it('false when card is not in stack', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card]);

            expect(stack.isCardAvailable(random.getAnotherRandomCard(card).id)).to.be.false;
        });
        it('false when card is not top one', () => {
            const card: Card = random.getRandomCard();
            const anotherCard: Card = random.getAnotherRandomCard(card);
            const stack = new TestCardStack([card, anotherCard]);

            expect(stack.isCardAvailable(card.id)).to.be.false;
        });
        it('true when card is the only one in stack', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card]);

            expect(stack.isCardAvailable(card.id)).to.be.true;
        });
        it('true when card is top one', () => {
            const card: Card = random.getRandomCard();
            const anotherCard: Card = random.getAnotherRandomCard(card);
            const stack = new TestCardStack([card, anotherCard]);

            expect(stack.isCardAvailable(anotherCard.id)).to.be.true;
        });
    });
    describe('pop', () => {
        it('throws when stack is empty', () => {
            const stack = new TestCardStack([]);

            expect((() => stack.pop())).to.throw;
        });
        it('returns top card', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card]);

            expect(stack.pop()).to.equal(card);
        });
    });
    describe('push', () => {
        it('throws when canPush returns false', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card], false);

            expect((() => stack.push(card))).to.throw;
        });
        it('pushes card when canPush returns true', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card], true);
            stack.push(card);

            expect(stack.pop()).to.equal(card);
        });
    });
    describe('contains', () => {
        it('false when card is not in stack', () => {
            const card = random.getRandomCard();
            const stack = new TestCardStack([card]);

            expect(stack.contains(random.getAnotherRandomCard(card).id)).to.be.false;
        });
        it('true when card is top card', () => {
            const card = random.getRandomCard();
            const anotherCard = random.getAnotherRandomCard(card);
            const stack = new TestCardStack([card, anotherCard]);

            expect(stack.contains(anotherCard.id)).to.true;
        });
        it('true when card is not top card', () => {
            const card = random.getRandomCard();
            const anotherCard = random.getAnotherRandomCard(card);
            const stack = new TestCardStack([card, anotherCard]);

            expect(stack.contains(card.id)).to.true;
        });
    });
});
