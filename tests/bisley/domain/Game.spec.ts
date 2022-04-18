import Game from '../../../src/bisley/domain/Game';
import Deck from '../../../src/shared/domain/Deck';
import { DeckBuilder, random } from '../../utils';
import Card from '../../../src/shared/domain/Card';
import CardValue from '../../../src/shared/domain/CardValue';
import CardMovedEvent from '../../../src/bisley/domain/events/CardMovedEvent';
import '../../assertions';
import { expect } from 'chai';
import CardStackType from '../../../src/bisley/domain/CardStackType';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('game', () => {
    describe('constructor', () => {
        it('can start with 52 cards', () => {
            expect(() => {
                new Game(Deck.getFullDeck().cards);
            }).to.not.throw;
        });
        it('cannot start with less than 52 cards', () => {
            expect(() => {
                new Game(Deck.getShortDeck().cards);
            }).to.throw;
        });
    });
    describe('can move', () => {
        it('true for top card in column', () => {
            const columnNumber = random.getRandomNumber(0, 12);
            const suit = random.getRandomSuit();
            const value = random.getRandomCardValueNotAce();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, value, columnNumber)
                .build();
            const card = deck.findCard(suit, value);
            const game = new Game(deck.cards);

            expect(game.canMove(card.id)).to.be.true;
        });
        it('false for not top card in column', () => {
            const columnNumber = random.getRandomNumber(0, 12);
            const suit = random.getRandomSuit();
            const value = random.getRandomCardValueNotAce();
            const deck: Deck = new DeckBuilder()
                .withCardInColumnAt(suit, value, columnNumber, 1)
                .build();
            const card = deck.findCard(suit, value);
            const game = new Game(deck.cards);

            expect(game.canMove(card.id)).to.be.false;
        });
        it('false for top card in ace foundation', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(suit, CardValue.Two)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(two.id);

            expect(game.canMove(two.id)).to.be.false;
        });
        it('false for not top card in ace foundation', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const three = deck.findCard(suit, CardValue.Three);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(two.id);
            game.moveCardToAnyFoundation(three.id);

            expect(game.canMove(two.id)).to.be.false;
        });
        it('false for ace in ace foundation', () => {
            const deck: Deck = Deck.getFullDeck();
            const game = new Game(deck.cards);
            const ace = deck.findCard(random.getRandomSuit(), CardValue.Ace);

            expect(game.canMove(ace.id)).to.be.false;
        });
        it('false for top card in king foundation when there is only king', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(suit, CardValue.King)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(king.id);

            expect(game.canMove(king.id)).to.be.false;
        });
        it('false for top card in king foundation when there are some cards', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.King, 1)
                .withAvailableCardInColumn(suit, CardValue.Queen, 2)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const queen = deck.findCard(suit, CardValue.Queen);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(king.id);
            game.moveCardToAnyFoundation(queen.id);

            expect(game.canMove(queen.id)).to.be.false;
        });
        it('false for not top card in king foundation', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.King, 1)
                .withAvailableCardInColumn(suit, CardValue.Queen, 2)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const queen = deck.findCard(suit, CardValue.Queen);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(king.id);
            game.moveCardToAnyFoundation(queen.id);

            expect(game.canMove(king.id)).to.be.false;
        });
    });
    describe('can move to any foundation', () => {
        it('false for unavailable card', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withUnavailableCard(suit, CardValue.Two)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);

            expect(game.canMoveCardToAnyFoundation(two.id)).to.be.false;
        });
        it('true for card in column able to be moved to ace foundation', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(suit, CardValue.Two)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);

            expect(game.canMoveCardToAnyFoundation(two.id)).to.be.true;
        });
        it('true for card in column able to be moved to king foundation', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(suit, CardValue.King)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const game = new Game(deck.cards);

            expect(game.canMoveCardToAnyFoundation(king.id)).to.be.true;
        });
        it('true for card in column able to be moved to ace foundation when there are some cards', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const three = deck.findCard(suit, CardValue.Three);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(two.id);

            expect(game.canMoveCardToAnyFoundation(three.id)).to.be.true;
        });
        it('true for card in column able to be moved to king foundation when there are some cards', () => {
            const suit = random.getRandomSuit();
            const deck: Deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.King, 1)
                .withAvailableCardInColumn(suit, CardValue.Queen, 2)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const queen = deck.findCard(suit, CardValue.Queen);
            const game = new Game(deck.cards);
            game.moveCardToAnyFoundation(king.id);

            expect(game.canMoveCardToAnyFoundation(queen.id)).to.be.true;
        });
        it('false for available card in ace foundation if can be moved to king foundation', () => {
            const suit = random.getRandomSuit();
            const toKingFoundation: CardValue[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine, CardValue.Eight];
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven];
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index));
            toAceFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index + toKingFoundation.length));
            const deck: Deck = deckBuilder.build();
            const toAceFoundationCards = toAceFoundation.map((value: CardValue) => deck.findCard(suit, value));
            const toKingFoundationCards = toKingFoundation.map((value: CardValue) => deck.findCard(suit, value));
            const seven = toAceFoundationCards[toAceFoundationCards.length - 1];
            const game = new Game(deck.cards);

            toKingFoundationCards.forEach((card: Card) => game.moveCardToAnyFoundation(card.id));
            toAceFoundationCards.forEach((card: Card) => game.moveCardToAnyFoundation(card.id));

            expect(game.canMoveCardToAnyFoundation(seven.id)).to.be.false;
        });
        it('false for available card in king foundation if can be moved to ace foundation', () => {
            const suit = random.getRandomSuit();
            const toKingFoundation: CardValue[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine, CardValue.Eight];
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven];
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index));
            toAceFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index + toKingFoundation.length));
            const deck: Deck = deckBuilder.build();
            const toAceFoundationCards = toAceFoundation.map((value: CardValue) => deck.findCard(suit, value));
            const toKingFoundationCards = toKingFoundation.map((value: CardValue) => deck.findCard(suit, value));
            const eight = toKingFoundationCards[toKingFoundationCards.length - 1];
            const game = new Game(deck.cards);

            toKingFoundationCards.forEach((card: Card) => game.moveCardToAnyFoundation(card.id));
            toAceFoundationCards.forEach((card: Card) => game.moveCardToAnyFoundation(card.id));

            expect(game.canMoveCardToAnyFoundation(eight.id)).to.be.false;
        });
    });
    describe('move to any foundation', () => {
        it('correct event when moved to ace foundation', () => {
            const suit = random.getRandomSuit();
            const columnNumber = random.getRandomNumber(0, 12);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, columnNumber)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveCardToAnyFoundation(two.id);

            const columnId = getStackId(game, CardStackType.Column, columnNumber);
            const aceFoundationIds = getStackIds(game, CardStackType.AceFoundation);
            expect(cardMovedEvent).to.not.be.null;
            expect(cardMovedEvent!.cardId).to.be.equal(two.id);
            expect(cardMovedEvent!.fromStackId).to.be.equal(columnId);
            expect(cardMovedEvent!.toStackId).to.be.in(aceFoundationIds);
        });
        it('correct event when moved to king foundation', () => {
            const suit = random.getRandomSuit();
            const columnNumber = random.getRandomNumber(0, 12);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.King, columnNumber)
                .build();
            const king = deck.findCard(suit, CardValue.King);
            const game = new Game(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveCardToAnyFoundation(king.id);

            const columnId = getStackId(game, CardStackType.Column, columnNumber);
            const kingFoundationIds = getStackIds(game, CardStackType.KingFoundation);
            expect(cardMovedEvent).to.not.be.null;
            expect(cardMovedEvent!.cardId).to.be.equal(king.id);
            expect(cardMovedEvent!.fromStackId).to.be.equal(columnId);
            expect(cardMovedEvent!.toStackId).to.be.in(kingFoundationIds);
        });
        it('correct event when can be moved to either ace or king foundation', () => {
            const suit = random.getRandomSuit();
            const toKingFoundation: CardValue[] = [CardValue.King, CardValue.Queen, CardValue.Jack, CardValue.Ten, CardValue.Nine];
            const toAceFoundation = [CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven];
            const eightColumnNumber = toKingFoundation.length + toAceFoundation.length;
            const deckBuilder = new DeckBuilder();
            toKingFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index));
            toAceFoundation.forEach((value: CardValue, index: number) =>
                deckBuilder.withAvailableCardInColumn(suit, value, index + toKingFoundation.length));
            deckBuilder.withAvailableCardInColumn(suit, CardValue.Eight, eightColumnNumber);

            const deck = deckBuilder.build();
            const eight = deck.findCard(suit, CardValue.Eight);
            const game = new Game(deck.cards);
            let cardMovedEvent: CardMovedEvent | null = null;

            toKingFoundation
                .map((value: CardValue) => deck.findCard(suit, value))
                .forEach((card: Card) => game.moveCardToAnyFoundation(card.id));
            toAceFoundation
                .map((value: CardValue) => deck.findCard(suit, value))
                .forEach((card: Card) => game.moveCardToAnyFoundation(card.id));

            game.onCardMoved.subscribe(event => cardMovedEvent = event);

            game.moveCardToAnyFoundation(eight.id);

            const columnId = getStackId(game, CardStackType.Column, eightColumnNumber);
            const aceFoundationIds = getStackIds(game, CardStackType.AceFoundation);
            expect(cardMovedEvent).to.not.be.null;
            expect(cardMovedEvent!.cardId).to.be.equal(eight.id);
            expect(cardMovedEvent!.fromStackId).to.be.equal(columnId);
            expect(cardMovedEvent!.toStackId).to.be.in(aceFoundationIds);
        });
    });
    describe('can move to column', () => {
        it('false for unavailable card', () => {
            const suit = random.getRandomSuit();
            const deck = new DeckBuilder()
                .withUnavailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);

            const columnId = getStackId(game, CardStackType.Column, 2);
            expect(game.canMoveCardToStack(two.id, columnId)).to.be.false;
        });
        it('true for next card of same suit', () => {
            const suit = random.getRandomSuit();
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const three = deck.findCard(suit, CardValue.Three);
            const game = new Game(deck.cards);

            const columnId = getStackId(game, CardStackType.Column, 1);
            expect(game.canMoveCardToStack(three.id, columnId)).to.be.true;
        });
        it('true for previous card of same suit', () => {
            const suit = random.getRandomSuit();
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);

            const columnId = getStackId(game, CardStackType.Column, 2);
            expect(game.canMoveCardToStack(two.id, columnId)).to.be.true;
        });
        it('false for next card of different suit', () => {
            const suit = random.getRandomSuit();
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(suit, CardValue.Three, 2)
                .build();
            const three = deck.findCard(random.getAnotherRandomSuit(suit), CardValue.Three);
            const game = new Game(deck.cards);

            const columnId = getStackId(game, CardStackType.Column, 1);
            expect(game.canMoveCardToStack(three.id, columnId)).to.be.false;
        });
        it('false for previous card of different suit', () => {
            const suit = random.getRandomSuit();
            const anotherSuit = random.getAnotherRandomSuit(suit);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, CardValue.Two, 1)
                .withAvailableCardInColumn(anotherSuit, CardValue.Three, 2)
                .build();
            const two = deck.findCard(suit, CardValue.Two);
            const game = new Game(deck.cards);

            const columnId = getStackId(game, CardStackType.Column, 2);
            expect(game.canMoveCardToStack(two.id, columnId)).to.be.false;
        });
        it('false for empty column', () => {
            const suit = random.getRandomSuit();
            const value = random.getRandomCardValueNotAce();
            const anotherSuit = random.getAnotherRandomSuit(suit);
            const deck = new DeckBuilder()
                .withAvailableCardInColumn(suit, value, 1)
                .withCardInColumnAt(anotherSuit, CardValue.Two, 2, 0)
                .withCardInColumnAt(anotherSuit, CardValue.Three, 2, 1)
                .withCardInColumnAt(anotherSuit, CardValue.Four, 2, 2)
                .withAvailableCardInColumn(anotherSuit, CardValue.Five, 3)
                .build();
            const card = deck.findCard(suit, value);
            const two = deck.findCard(anotherSuit, CardValue.Two);
            const three = deck.findCard(anotherSuit, CardValue.Three);
            const four = deck.findCard(anotherSuit, CardValue.Four);
            const game = new Game(deck.cards);

            let columnId = getStackId(game, CardStackType.Column, 3);
            game.moveCardToStack(four.id, columnId);
            game.moveCardToStack(three.id, columnId);
            game.moveCardToStack(two.id, columnId);

            columnId = getStackId(game, CardStackType.Column, 2);
            expect(game.canMoveCardToStack(card.id, columnId)).to.be.false;
        });
    });
});

function getStackId(game: Game, type: CardStackType, number: number): number {
    return game.getCardsDisposition()
        .stacks
        .filter(s => s.type === type)[number]
        .id;
}

function getStackIds(game: Game, type: CardStackType): number[] {
    return game.getCardsDisposition()
        .stacks
        .filter(s => s.type === type)
        .map(s => s.id);
}
