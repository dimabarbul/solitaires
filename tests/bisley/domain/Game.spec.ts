import Game from '../../../src/bisley/domain/Game';
import Deck from '../../../src/core/Deck';
import { DeckBuilder, getAnotherRandomSuit, getRandomElement, getRandomNumber, getRandomSuit } from './utils';
import CardDto from '../../../src/bisley/domain/dto/CardDto';
import Card from '../../../src/core/Card';
import CardValue from '../../../src/core/CardValue';
import CardMovedEvent from '../../../src/bisley/domain/events/CardMovedEvent';
import CardPositionType from '../../../src/bisley/domain/CardPositionType';
import '../../assertions';
import { expect } from 'chai';

describe('game', () => {
    describe('start', () => {
        it('can start with 52 cards', () => {
            expect(() => {
                const game = new Game();
                game.start(Deck.getFullDeck().cards);
            }).to.not.throw;
        });
        it('cannot start with less than 52 cards', () => {
            expect(() => {
                const game = new Game();
                game.start(Deck.getShortDeck().cards);
            }).to.throw;
        });
    });
    describe('can move', () => {
        it('true for top card in column', () => {
            const card = getRandomCardNotAce();
            const columnNumber = getRandomNumber(0, 12);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(card, columnNumber)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMove(CardDto.fromCard(card))).to.be.true;
        });
        it('false for not top card in column', () => {
            const card = getRandomCardNotAce();
            const columnNumber = getRandomNumber(0, 12);
            const deck: Deck = new DeckBuilder()
                .withCardInColumnAt(card, columnNumber, 1)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMove(CardDto.fromCard(card))).to.be.false;
        });
        it('false for top card in ace foundation', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(two)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(two));

            expect(game.canMove(CardDto.fromCard(two))).to.be.false;
        });
        it('false for not top card in ace foundation', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(suit, CardValue.Three);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(two));
            game.moveToAnyFoundation(CardDto.fromCard(three));

            expect(game.canMove(CardDto.fromCard(two))).to.be.false;
        });
        it('false for ace in ace foundation', () => {
            const deck: Deck = Deck.getFullDeck();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMove(CardDto.fromCard(new Card(getRandomSuit(), CardValue.Ace)))).to.be.false;
        });
        it('false for top card in king foundation when there is only king', () => {
            const king = new Card(getRandomSuit(), CardValue.King);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(king)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(king));

            expect(game.canMove(CardDto.fromCard(king))).to.be.false;
        });
        it('false for top card in king foundation when there are some cards', () => {
            const suit = getRandomSuit();
            const king = new Card(suit, CardValue.King);
            const queen = new Card(suit, CardValue.Queen);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(king, 1)
                .withAvailableCardInColumn(queen, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(king));
            game.moveToAnyFoundation(CardDto.fromCard(queen));

            expect(game.canMove(CardDto.fromCard(queen))).to.be.false;
        });
        it('false for not top card in king foundation', () => {
            const suit = getRandomSuit();
            const king = new Card(suit, CardValue.King);
            const queen = new Card(suit, CardValue.Queen);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(king, 1)
                .withAvailableCardInColumn(queen, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(king));
            game.moveToAnyFoundation(CardDto.fromCard(queen));

            expect(game.canMove(CardDto.fromCard(king))).to.be.false;
        });
    });
    describe('can move to any foundation', () => {
        it('false for unavailable card', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withUnavailableCard(two)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(two))).to.be.false;
        });
        it('true for card in column able to be moved to ace foundation', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(two)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(two))).to.be.true;
        });
        it('true for card in column able to be moved to king foundation', () => {
            const king = new Card(getRandomSuit(), CardValue.King);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(king)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(king))).to.be.true;
        });
        it('true for card in column able to be moved to ace foundation when there are some cards', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(suit, CardValue.Three);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(two));

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(three))).to.be.true;
        });
        it('true for card in column able to be moved to king foundation when there are some cards', () => {
            const suit = getRandomSuit();
            const king = new Card(suit, CardValue.King);
            const queen = new Card(suit, CardValue.Queen);
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(king, 1)
                .withAvailableCardInColumn(queen, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(king));

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(queen))).to.be.true;
        });
        it('false for available card in ace foundation if can be moved to king foundation', () => {
            const suit = getRandomSuit();
            const toKingFoundation: Card[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine, CardValue.Eight]
                .map(value => new Card(suit, value));
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven]
                .map(value => new Card(suit, value));
            const seven = toAceFoundation[toAceFoundation.length - 1];
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index));
            toAceFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index + toKingFoundation.length));
            const deck: Deck = deckBuilder.build();
            const game = new Game();
            game.start(deck.cards);

            toKingFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));
            toAceFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(seven))).to.be.false;
        });
        it('false for available card in king foundation if can be moved to ace foundation', () => {
            const suit = getRandomSuit();
            const toKingFoundation: Card[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine, CardValue.Eight]
                .map(value => new Card(suit, value));
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven]
                .map(value => new Card(suit, value));
            const eight = toKingFoundation[toKingFoundation.length - 1];
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index));
            toAceFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index + toKingFoundation.length));
            const deck: Deck = deckBuilder.build();
            const game = new Game();
            game.start(deck.cards);

            toKingFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));
            toAceFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));

            expect(game.canMoveToAnyFoundation(CardDto.fromCard(eight))).to.be.false;
        });
    });
    describe('move to any foundation', () => {
        it('correct event when moved to ace foundation', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const columnNumber = getRandomNumber(0, 12);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(two, columnNumber)
                .build();
            const game = new Game();
            game.start(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveToAnyFoundation(CardDto.fromCard(two));

            expect(cardMovedEvent.card).to.be.cardDto(two);
            expect(cardMovedEvent.fromPosition.position).to.equal(CardPositionType.Column);
            expect(cardMovedEvent.fromPosition.positionIndex).to.equal(columnNumber);
            expect(cardMovedEvent.fromPosition.index).to.equal(columnNumber < 4 ? 2 : 3);
            expect(cardMovedEvent.toPosition.position).to.equal(CardPositionType.AceFoundation);
            expect(cardMovedEvent.toPosition.positionIndex).to.be.within(0, 3);
            expect(cardMovedEvent.toPosition.index).to.equal(1);
        });
        it('correct event when moved to king foundation', () => {
            const king = new Card(getRandomSuit(), CardValue.King);
            const columnNumber = getRandomNumber(0, 12);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(king, columnNumber)
                .build();
            const game = new Game();
            game.start(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveToAnyFoundation(CardDto.fromCard(king));

            expect(cardMovedEvent.card).to.be.cardDto(king);
            expect(cardMovedEvent.fromPosition.position).to.equal(CardPositionType.Column);
            expect(cardMovedEvent.fromPosition.positionIndex).to.equal(columnNumber);
            expect(cardMovedEvent.fromPosition.index).to.equal(columnNumber < 4 ? 2 : 3);
            expect(cardMovedEvent.toPosition.position).to.equal(CardPositionType.KingFoundation);
            expect(cardMovedEvent.toPosition.positionIndex).to.be.within(0, 3);
            expect(cardMovedEvent.toPosition.index).to.equal(0);
        });
        it('correct event when can be moved to either ace or king foundation', () => {
            const suit = getRandomSuit();
            const toKingFoundation: Card[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine]
                .map(value => new Card(suit, value));
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven]
                .map(value => new Card(suit, value));
            const eight = new Card(suit, CardValue.Eight);
            const eightColumnNumber = toKingFoundation.length + toAceFoundation.length;
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index));
            toAceFoundation.forEach((card: Card, index: number) => deckBuilder.withAvailableCardInColumn(card, index + toKingFoundation.length));

            deckBuilder.withAvailableCardInColumn(eight, eightColumnNumber);
            const deck = deckBuilder.build();
            const game = new Game();
            game.start(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            toKingFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));
            toAceFoundation.forEach((card: Card) => game.moveToAnyFoundation(CardDto.fromCard(card)));

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveToAnyFoundation(CardDto.fromCard(eight));

            expect(cardMovedEvent.card).to.be.cardDto(eight);
            expect(cardMovedEvent.fromPosition.position).to.equal(CardPositionType.Column);
            expect(cardMovedEvent.fromPosition.positionIndex).to.equal(eightColumnNumber);
            expect(cardMovedEvent.fromPosition.index).to.equal(3);
            expect(cardMovedEvent.toPosition.position).to.equal(CardPositionType.AceFoundation);
            expect(cardMovedEvent.toPosition.positionIndex).to.be.within(0, 3);
            // + 1 because of ace
            expect(cardMovedEvent.toPosition.index).to.equal(toAceFoundation.length + 1);
        });
    });
    describe('can move to column', () => {
        it('false for unavailable card', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(suit, CardValue.Three);
            const deck = new DeckBuilder()
                .withUnavailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToColumn(CardDto.fromCard(two), 2)).to.be.false;
        });
        it('true for next card of same suit', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(suit, CardValue.Three);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToColumn(CardDto.fromCard(three), 1)).to.be.true;
        });
        it('true for previous card of same suit', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(suit, CardValue.Three);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToColumn(CardDto.fromCard(two), 2)).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(getAnotherRandomSuit(suit), CardValue.Three);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToColumn(CardDto.fromCard(three), 1)).to.be.false;
        });
        it('false for previous card of different suit', () => {
            const suit = getRandomSuit();
            const two = new Card(suit, CardValue.Two);
            const three = new Card(getAnotherRandomSuit(suit), CardValue.Three);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(two, 1)
                .withAvailableCardInColumn(three, 2)
                .build();
            const game = new Game();
            game.start(deck.cards);

            expect(game.canMoveToColumn(CardDto.fromCard(two), 2)).to.be.false;
        });
        it('false for empty column', () => {
            const suit = getRandomSuit();
            const anotherSuit = getAnotherRandomSuit(suit);
            const card = new Card(suit, getRandomCardValueNotAce());
            const two = new Card(anotherSuit, CardValue.Two);
            const three = new Card(anotherSuit, CardValue.Three);
            const four = new Card(anotherSuit, CardValue.Four);
            const five = new Card(anotherSuit, CardValue.Five);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(card, 1)
                .withCardInColumnAt(two, 2, 0)
                .withCardInColumnAt(three, 2, 1)
                .withCardInColumnAt(four, 2, 2)
                .withAvailableCardInColumn(five, 3)
                .build();
            const game = new Game();
            game.start(deck.cards);

            game.moveToColumn(CardDto.fromCard(four), 3);
            game.moveToColumn(CardDto.fromCard(three), 3);
            game.moveToColumn(CardDto.fromCard(two), 3);

            expect(game.canMoveToColumn(CardDto.fromCard(card), 2)).to.be.false;
        });
    });
});

function getRandomCardValueNotAce(): CardValue {
    return getRandomElement([
        CardValue.Two, CardValue.Three, CardValue.Four,
        CardValue.Five, CardValue.Six, CardValue.Seven,
        CardValue.Eight, CardValue.Nine, CardValue.Ten,
        CardValue.Jack, CardValue.Queen, CardValue.King,
    ]);
}

function getRandomCardNotAce(): Card {
    return new Card(getRandomSuit(), getRandomCardValueNotAce());
}
