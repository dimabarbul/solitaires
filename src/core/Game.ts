import Card from './Card';
import CardValue, { getShortDeckDifference } from './CardValue';
import CardsDispositionDto from './dto/CardsDispositionDto';
import BaseDto from './dto/BaseDto';
import RowDto from './dto/RowDto';
import CardDto from './dto/CardDto';
import EventHandler from './EventHandler';
import CardPosition from './CardPosition';
import CardPositionType from './CardPositionType';
import CardMovedEvent from './events/CardMovedEvent';

export default class Game {
    private readonly _bases: Card[][] = new Array(4);
    private readonly _rows: Card[][] = new Array(8);

    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();

    public start(cards: Card[]): void {
        if (cards.length !== 36) {
            throw new Error(`Invalid number of cards. Expected 36, got ${cards.length}`);
        }

        this.initBases(cards);
        this.initRows(cards);
    }

    public canMoveCardToBase(fromRowNumber: number): boolean {
        if (this._rows[fromRowNumber].length === 0) {
            return false;
        }

        const rowCard = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];
        const baseIndex: number = this.getBaseIndex(rowCard);
        const baseCard: Card = this._bases[baseIndex][this._bases[baseIndex].length - 1];

        return getShortDeckDifference(rowCard.value, baseCard.value) === 1;
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

    public moveCardToBase(fromRowNumber: number): void {
        if (!this.canMoveCardToBase(fromRowNumber)) {
            throw new Error(`Cannot move card to base: ${fromRowNumber}`);
        }

        const rowCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];
        const baseIndex: number = this.getBaseIndex(rowCard);

        this._bases[baseIndex].push(rowCard);
        this._rows[fromRowNumber].pop();

        this.onCardMoved.trigger(new CardMovedEvent(
            CardDto.fromCard(rowCard),
            new CardPosition(CardPositionType.Row, fromRowNumber, this._rows[fromRowNumber].length),
            new CardPosition(CardPositionType.Base, baseIndex, this._bases[baseIndex].length - 1)));
    }

    public moveCardToRow(fromRowNumber: number, toRowNumber: number): void {
        if (!this.canMoveCardToRow(fromRowNumber, toRowNumber)) {
            throw new Error(`Cannot move card to row: ${fromRowNumber} => ${toRowNumber}`);
        }

        const sourceCard: Card = this._rows[fromRowNumber][this._rows[fromRowNumber].length - 1];

        this._rows[toRowNumber].push(sourceCard);
        this._rows[fromRowNumber].pop();

        this.onCardMoved.trigger(new CardMovedEvent(
            CardDto.fromCard(sourceCard),
            new CardPosition(CardPositionType.Row, fromRowNumber, this._rows[fromRowNumber].length),
            new CardPosition(CardPositionType.Row, toRowNumber, this._rows[toRowNumber].length - 1)));
    }

    public isGameFinished(): boolean {
        for (let i = 0; i < 4; i++) {
            if (this._bases[i].length !== 13) {
                return false;
            }
        }

        return true;
    }

    public getCardsDisposition(): CardsDispositionDto {
        const bases: BaseDto[] = [];
        const rows: RowDto[] = [];

        for (let i = 0; i < this._bases.length; i++) {
            bases.push(new BaseDto(
                this._bases[i]
                    .map(card => new CardDto(card.suit, card.value))));
        }

        for (let i = 0; i < this._rows.length; i++) {
            rows.push(new RowDto(
                this._rows[i]
                    .map(card => new CardDto(card.suit, card.value))));
        }

        return new CardsDispositionDto(bases, rows);
    }

    private getBaseIndex(card: Card): number {
        for (let i = 0; i < this._bases.length; i++) {
            if (this._bases[i][0].suit === card.suit) {
                return i;
            }
        }

        throw new Error(`Cannot find base for suit ${card.suit}`);
    }

    private initBases(cards: Card[]) {
        let baseIndex = 0;
        for (const card of cards) {
            if (card.value === CardValue.Ace) {
                this._bases[baseIndex++] = [card];
            }
        }
    }

    private initRows(cards: Card[]) {
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
}