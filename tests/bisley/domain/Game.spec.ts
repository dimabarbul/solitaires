import * as assert from 'assert';
import Game from '../../../src/bisley/domain/Game';
import Deck from '../../../src/core/Deck';
import { DeckBuilder, getRandomElement, getRandomNumber, getRandomSuit } from './utils';
import CardDto from '../../../src/bisley/domain/dto/CardDto';
import Card from '../../../src/core/Card';
import CardValue from '../../../src/core/CardValue';

describe('game', () => {
    describe('start', () => {
        it('can start with 52 cards', () => {
            assert.doesNotThrow(() => {
                const game = new Game();
                game.start(Deck.getFullDeck().cards);
            });
        });
        it('cannot start with less than 52 cards', () => {
            assert.throws(() => {
                const game = new Game();
                game.start(Deck.getShortDeck().cards);
            });
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

            assert.strictEqual(game.canMove(CardDto.fromCard(card)), true);
        });
        it('false for not top card in column', () => {
            const card = getRandomCardNotAce();
            const columnNumber = getRandomNumber(0, 12);
            const deck: Deck = new DeckBuilder()
                .withCardInColumnAt(card, columnNumber, 1)
                .build();
            const game = new Game();
            game.start(deck.cards);

            assert.strictEqual(game.canMove(CardDto.fromCard(card)), false);
        });
        it('false for top card in ace foundation', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(two)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(two));

            assert.strictEqual(game.canMove(CardDto.fromCard(two)), false);
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

            assert.strictEqual(game.canMove(CardDto.fromCard(two)), false);
        });
        it('false for ace in ace foundation', () => {
            const deck: Deck = Deck.getFullDeck();
            const game = new Game();
            game.start(deck.cards);

            assert.strictEqual(game.canMove(CardDto.fromCard(new Card(getRandomSuit(), CardValue.Ace))), false);
        });
        it('false for top card in king foundation when there is only king', () => {
            const king = new Card(getRandomSuit(), CardValue.King);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(king)
                .build();
            const game = new Game();
            game.start(deck.cards);
            game.moveToAnyFoundation(CardDto.fromCard(king));

            assert.strictEqual(game.canMove(CardDto.fromCard(king)), false);
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

            assert.strictEqual(game.canMove(CardDto.fromCard(queen)), false);
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

            assert.strictEqual(game.canMove(CardDto.fromCard(king)), false);
        });
    });
    describe('can move to any foundation', () => {
        it('false for not available card', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withCardInColumnAt(two, getRandomNumber(0, 12), 1)
                .build();
            const game = new Game();
            game.start(deck.cards);

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(two)), false);
        });
        it('true for card in column able to be moved to ace foundation', () => {
            const two = new Card(getRandomSuit(), CardValue.Two);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(two)
                .build();
            const game = new Game();
            game.start(deck.cards);

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(two)), true);
        });
        it('true for card in column able to be moved to king foundation', () => {
            const king = new Card(getRandomSuit(), CardValue.King);
            const deck: Deck = new DeckBuilder()
                .withAvailableCard(king)
                .build();
            const game = new Game();
            game.start(deck.cards);

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(king)), true);
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

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(three)), true);
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

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(queen)), true);
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

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(seven)), false);
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

            assert.strictEqual(game.canMoveToAnyFoundation(CardDto.fromCard(eight)), false);
        });
    });
});

function getRandomCardValueNotAce() {
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
