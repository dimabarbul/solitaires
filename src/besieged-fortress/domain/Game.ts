import Card from '../../shared/domain/Card';
import CardValue from '../../shared/domain/CardValue';
import { ICommand } from '../../shared/libs/Commands';
import Foundation from './Foundation';
import Row from './Row';
import AbstractGame from '../../shared/domain/AbstractGame';
import CardStackType from './CardStackType';

export default class Game extends AbstractGame<CardStackType> {
    private readonly _foundations: Foundation[] = new Array(4);
    private readonly _rows: Row[] = new Array(8);

    public constructor(cards: readonly Card[]) {
        super();

        if (cards.length !== 36) {
            throw new Error(`Invalid number of cards. Expected 36, got ${cards.length}`);
        }

        this.createFoundations(cards);
        this.createRows(cards);
        this.fillStacks([this._foundations, this._rows]);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.canMoveCardToStackOfType(cardId, [CardStackType.Foundation]);
    }

    public moveCardToAnyFoundation(cardId: number): ICommand {
        return this.moveCardToStackOfType(cardId, [CardStackType.Foundation]);
    }

    public isGameFinished(): boolean {
        return this._rows.every(r => r.isEmpty);
    }

    private createFoundations(cards: readonly Card[]): void {
        let foundationIndex = 0;

        for (const card of cards) {
            if (card.value === CardValue.Ace) {
                this._foundations[foundationIndex] = new Foundation(foundationIndex, card);
                foundationIndex++;
            }
        }
    }

    private createRows(cards: readonly Card[]): void {
        const startId: number = this._foundations.length;
        const cardsWithoutAces: Card[] = cards.filter(card => card.value !== CardValue.Ace);

        for (let i = 0; i < 8; i++) {
            this._rows[i] = new Row(i + startId, cardsWithoutAces.slice(i * 4, (i + 1) * 4));
        }
    }
}
