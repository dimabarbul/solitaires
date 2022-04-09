﻿import Card from '../../core/Card';
import CardDto from './dto/CardDto';
import RowDto from './dto/RowDto';
import CardPositionType from './CardPositionType';
import CardMovedEvent from './events/CardMovedEvent';
import CardsDispositionDto from './dto/CardsDispositionDto';
import BaseDto from './dto/BaseDto';
import CardPosition from './CardPosition';
import CardValue, { getShortDeckDifference } from '../../core/CardValue';
import EventHandler from '../../core/EventHandler';
import ICommand from '../../core/ICommand';
import Command from '../../core/Command';

export default class Game {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();

    private readonly _bases: Card[][] = new Array(4);
    private readonly _rows: Card[][] = new Array(8);

    public start(cards: Card[]): void {
        if (cards.length !== 36) {
            throw new Error(`Invalid number of cards. Expected 36, got ${cards.length}`);
        }

        this.initEvents();
        this.initBases(cards);
        this.initRows(cards);
    }

    public canMoveCardToAnyBase(fromRowNumber: number): boolean {
        if (this._rows[fromRowNumber].length === 0) {
            return false;
        }

        const rowCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];

        return this.canMoveCardToBase(fromRowNumber, this.getBaseNumber(rowCard));
    }

    public canMoveCardToBase(fromRowNumber: number, toBaseNumber: number): boolean {
        if (this._rows[fromRowNumber].length === 0) {
            return false;
        }

        const rowCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];
        const baseCard: Card = this._bases[toBaseNumber][this._bases[toBaseNumber].length - 1];

        return rowCard.suit === baseCard.suit
            && getShortDeckDifference(rowCard.value, baseCard.value) === 1;
    }

    public canMoveCardToRow(fromRowNumber: number, toRowNumber: number): boolean {
        if (this._rows[fromRowNumber].length === 0) {
            return false;
        }

        if (this._rows[toRowNumber].length === 0) {
            return true;
        }

        const sourceCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];
        const targetCard: Card = this._rows[toRowNumber][this._rows[toRowNumber].length - 1];

        return getShortDeckDifference(sourceCard.value, targetCard.value) === -1;
    }

    public moveCardToBase(fromRowNumber: number): ICommand {
        if (!this.canMoveCardToAnyBase(fromRowNumber)) {
            throw new Error(`Cannot move card to base: ${fromRowNumber}`);
        }

        const rowCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];
        const baseNumber: number = this.getBaseNumber(rowCard);

        const command: Command = new Command(
            this.moveCardFromRowToBase.bind(this, fromRowNumber, baseNumber),
            this.moveCardFromBaseToRow.bind(this, baseNumber, fromRowNumber),
        );

        command.execute();

        return command;
    }

    public moveCardToRow(fromRowNumber: number, toRowNumber: number): ICommand {
        if (!this.canMoveCardToRow(fromRowNumber, toRowNumber)) {
            throw new Error(`Cannot move card to row: ${fromRowNumber} => ${toRowNumber}`);
        }

        const command: Command = new Command(
            this.moveCardFromRowToRow.bind(this, fromRowNumber, toRowNumber),
            this.moveCardFromRowToRow.bind(this, toRowNumber, fromRowNumber),
        );

        command.execute();

        return command;
    }

    public isGameFinished(): boolean {
        for (let i = 0; i < 4; i++) {
            if (this._bases[i].length !== 9) {
                return false;
            }
        }

        return true;
    }

    public getCardsDisposition(): CardsDispositionDto {
        const bases: BaseDto[] = [];
        const rows: RowDto[] = [];

        for (const item of this._bases) {
            bases.push(new BaseDto(
                item
                    .map(card => new CardDto(card.suit, card.value))));
        }

        for (const item of this._rows) {
            rows.push(new RowDto(
                item
                    .map(card => new CardDto(card.suit, card.value))));
        }

        return new CardsDispositionDto(bases, rows);
    }

    private initEvents(): void {
        this.onCardMoved.subscribe(_ => {
            this.checkIfGameIsFinished();
        })
    }

    private getBaseNumber(card: Card): number {
        for (let i = 0; i < this._bases.length; i++) {
            if (this._bases[i][0].suit === card.suit) {
                return i;
            }
        }

        throw new Error(`Cannot find base for suit ${card.suit}`);
    }

    private initBases(cards: Card[]): void {
        let baseIndex = 0;

        for (const card of cards) {
            if (card.value === CardValue.Ace) {
                this._bases[baseIndex++] = [card];
            }
        }
    }

    private initRows(cards: Card[]): void {
        let rowIndex = 0;

        for (const card of cards) {
            if (card.value !== CardValue.Ace) {
                this._rows[rowIndex] ||= [];
                this._rows[rowIndex].push(card);

                if (this._rows[rowIndex].length === 4) {
                    rowIndex++;
                }
            }
        }
    }

    private checkIfGameIsFinished(): void {
        if (this.isGameFinished()) {
            this.onGameFinished.trigger();
        }
    }

    private moveCardFromRowToRow(fromRowNumber: number, toRowNumber: number): void {
        const sourceCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];

        this._rows[toRowNumber].push(sourceCard);
        this._rows[fromRowNumber].pop();

        this.onCardMoved.trigger(new CardMovedEvent(
            CardDto.fromCard(sourceCard),
            new CardPosition(CardPositionType.Row, fromRowNumber, this._rows[fromRowNumber].length),
            new CardPosition(CardPositionType.Row, toRowNumber, this._rows[toRowNumber].length - 1)));
    }

    private moveCardFromRowToBase(fromRowNumber: number, toBaseNumber: number): void {
        const card: Card = this._rows[fromRowNumber].pop()
            ?? ((): never => {
                throw new Error(`Cannot move card from row ${fromRowNumber} to base ${toBaseNumber}: no card in the row.`);
            })();
        this._bases[toBaseNumber].push(card);

        this.onCardMoved.trigger(new CardMovedEvent(
            CardDto.fromCard(card),
            new CardPosition(CardPositionType.Row, fromRowNumber, this._rows[fromRowNumber].length),
            new CardPosition(CardPositionType.Base, toBaseNumber, this._bases[toBaseNumber].length - 1)));
    }

    private moveCardFromBaseToRow(fromBaseNumber: number, toRowNumber: number): void {
        const card: Card = this._bases[fromBaseNumber].pop()
            ?? ((): never => {
                throw new Error(`Cannot move card from base ${fromBaseNumber} to row ${toRowNumber}: no card in the base.`);
            })();
        this._rows[toRowNumber].push(card);

        this.onCardMoved.trigger(new CardMovedEvent(
            CardDto.fromCard(card),
            new CardPosition(CardPositionType.Base, fromBaseNumber, this._bases[fromBaseNumber].length),
            new CardPosition(CardPositionType.Row, toRowNumber, this._rows[toRowNumber].length - 1)));
    }
}