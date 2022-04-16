import Card from '../../shared/domain/Card';
import CardMovedEvent from './events/CardMovedEvent';
import CardsDispositionDto from './dto/CardsDispositionDto';
import CardValue from '../../shared/domain/CardValue';
import EventHandler from '../../shared/domain/EventHandler';
import ICommand from '../../shared/domain/ICommand';
import Command from '../../shared/domain/Command';
import Foundation from './Foundation';
import Row from './Row';
import CardStack from '../../shared/domain/CardStack';
import CardStackType from './CardStackType';

export default class Game {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();

    private readonly _foundations: Foundation[] = new Array(4);
    private readonly _rows: Row[] = new Array(8);
    private _stacks: { [key: number]: CardStack<CardStackType> } = {};

    public start(cards: Card[]): void {
        if (cards.length !== 36) {
            throw new Error(`Invalid number of cards. Expected 36, got ${cards.length}`);
        }

        this.initEvents();
        this.initFoundations(cards);
        this.initRows(cards);
        this.fillStacks();
    }

    public canMove(cardId: number): boolean {
        for (const stack of Object.values(this._stacks)) {
            if (stack.isCardAvailable(cardId)) {
                return true;
            }
        }

        return false;
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        if (!this.canMove(cardId)) {
            return false;
        }

        const card: Card = this.getCard(cardId);

        return this._foundations.some(f => f.canPush(card))
    }

    public canMoveCardToStack(cardId: number, stackId: number): boolean {
        return this.canMove(cardId)
            && !this._stacks[stackId].contains(cardId)
            && this._stacks[stackId].canPush(this.getCard(cardId));
    }

    public moveCardToAnyFoundation(cardId: number): ICommand {
        if (!this.canMoveCardToAnyFoundation(cardId)) {
            throw new Error(`Cannot move card ${cardId} to foundation`);
        }

        const targetStackId: number = this.getFoundationId(cardId);

        return this.moveCardToStack(cardId, targetStackId);
    }

    public moveCardToStack(cardId: number, stackId: number): ICommand {
        if (!this.canMoveCardToStack(cardId, stackId)) {
            throw new Error(`Cannot move card ${cardId} to stack ${stackId}`);
        }

        const sourceStackId: number = this.getCardStackId(cardId);

        const command: Command = new Command(
            this.moveCardFromStackToStack.bind(this, sourceStackId, stackId),
            this.moveCardFromStackToStack.bind(this, stackId, sourceStackId, false),
        );

        command.execute();

        return command;
    }

    public isGameFinished(): boolean {
        return this._rows.every(r => r.isEmpty);
    }

    public getCardsDisposition(): CardsDispositionDto {
        return new CardsDispositionDto(
            Object.values(this._stacks).map(s => s.mapToDto()));
    }

    private initEvents(): void {
        this.onCardMoved.subscribe(_ => {
            this.checkIfGameIsFinished();
        })
    }

    private getFoundationId(cardId: number): number {
        const card = this.getCard(cardId);

        const foundation = this._foundations.find(f => f.suit === card.suit);

        if (foundation === undefined) {
            throw new Error(`Foundation not found for card ${cardId}`);
        }

        return foundation.id;
    }

    private initFoundations(cards: Card[]): void {
        let foundationIndex = 0;

        for (const card of cards) {
            if (card.value === CardValue.Ace) {
                this._foundations[foundationIndex] = new Foundation(foundationIndex, card);
                foundationIndex++;
            }
        }
    }

    private initRows(cards: Card[]): void {
        const startId: number = this._foundations.length;
        const cardsWithoutAces: Card[] = cards.filter(card => card.value !== CardValue.Ace);

        for (let i = 0; i < 8; i++) {
            this._rows[i] = new Row(i + startId, cardsWithoutAces.slice(i * 4, (i + 1) * 4));
        }
    }

    private fillStacks(): void {
        this._stacks = {};
        const stacks = this._foundations.map(f => <CardStack<CardStackType>>f)
            .concat(this._rows);

        for (const stack of stacks) {
            this._stacks[stack.id] = stack;
        }
    }

    private checkIfGameIsFinished(): void {
        if (this.isGameFinished()) {
            this.onGameFinished.trigger();
        }
    }

    private moveCardFromStackToStack(sourceStackId: number, targetStackId: number, validateCard: boolean = true): void {
        const card = this._stacks[sourceStackId].pop();
        this._stacks[targetStackId].push(card, validateCard);

        this.onCardMoved.trigger(new CardMovedEvent(
            card.id,
            sourceStackId,
            targetStackId));
    }

    private getCard(cardId: number): Card {
        for (const stack of Object.values(this._stacks)) {
            const card = stack.findCard(cardId);

            if (card !== null) {
                return card;
            }
        }

        throw new Error(`Cannot find card with id ${cardId}`);
    }

    private getCardStackId(cardId: number): number {
        for (const stack of Object.values(this._stacks)) {
            if (stack.contains(cardId)) {
                return stack.id;
            }
        }

        throw new Error(`Cannot find card with id ${cardId}`);
    }
}
