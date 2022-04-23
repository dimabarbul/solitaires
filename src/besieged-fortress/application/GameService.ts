import Game from '../domain/Game';
import EventHandler from '../../shared/libs/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../../shared/domain/dto/CardsDispositionDto';
import Card from '../../shared/domain/Card';
import History from '../../shared/libs/History';
import { ICommand } from '../../shared/libs/Commands';
import CardStackType from '../domain/CardStackType';

export default class GameService {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    private _game: Game|null = null;
    private readonly _history: History = new History();

    public get game(): Game {
        if (this._game === null) {
            throw new Error('Game is not initialized');
        }

        return this._game;
    }

    public start(cards: Card[]): void {
        this._game = new Game(cards);
        this._history.clear();
        this.initEvents();
    }

    public getCardsDisposition(): CardsDispositionDto<CardStackType> {
        return this.game.getCardsDisposition();
    }

    public canMoveCard(cardId: number): boolean {
        return this.game.canMove(cardId);
    }

    public canMoveCardToCard(sourceCardId: number, targetCardId: number): boolean {
        if (!this.canMoveCard(sourceCardId)) {
            return false;
        }

        const targetStackId = this.getCardStackId(targetCardId);

        return this.game.canMoveCardToStack(sourceCardId, targetStackId);
    }

    public canMoveCardToEmptyRow(cardId: number, stackId: number): boolean {
        return this.isStackEmpty(stackId)
            && this.game.canMoveCardToStack(cardId, stackId);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.game.canMoveCardToAnyFoundation(cardId);
    }

    public canMoveCardToFoundation(cardId: number, foundationId: number): boolean {
        return this.game.canMoveCardToStack(cardId, foundationId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetStackId = this.getCardStackId(targetCardId);
        const command = this.game.moveCardToStack(sourceCardId, targetStackId);

        this._history.pushCommand(command);
    }

    public moveCardToEmptyRow(cardId: number, stackId: number): void {
        if (!this.isStackEmpty(stackId)) {
            throw new Error(`Stack ${stackId} is not empty`);
        }
        
        const command: ICommand = this.game.moveCardToStack(cardId, stackId);
        this._history.pushCommand(command);
    }

    public moveCardToAnyFoundation(cardId: number): void {
        const command: ICommand = this.game.moveCardToAnyFoundation(cardId);
        this._history.pushCommand(command);
    }

    public moveCardToFoundation(cardId: number, foundationId: number): void {
        const command: ICommand = this.game.moveCardToStack(cardId, foundationId);
        this._history.pushCommand(command);
    }

    public undo(): void {
        if (!this.canUndo()) {
            throw new Error('Cannot undo');
        }

        const command: ICommand = this._history.moveBack();
        command.undo();
    }

    public redo(): void {
        if (!this.canRedo()) {
            throw new Error('Cannot redo');
        }

        const command: ICommand = this._history.moveForward();
        command.execute();
    }

    public canUndo(): boolean {
        return this._history.canMoveBack();
    }

    public canRedo(): boolean {
        return this._history.canMoveForward();
    }

    private getCardStackId(cardId: number): number {
        const cardsDisposition = this.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            for (const card of stack.cards) {
                if (card.id === cardId) {
                    return stack.id;
                }
            }
        }

        throw new Error(`Card with id ${cardId} not found`);
    }

    private initEvents(): void {
        this.game.onCardMoved.subscribe(this.onCardMoved.trigger.bind(this.onCardMoved));
        this.game.onGameFinished.subscribe(this.onGameFinished.trigger.bind(this.onGameFinished));
        this._history.onHistoryChanged.subscribe(this.onHistoryChanged.trigger.bind(this.onHistoryChanged));
    }
    
    private isStackEmpty(stackId: number): boolean {
        const cardsDisposition = this.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            if (stack.id === stackId) {
                return stack.cards.length === 0;
            }
        }

        throw new Error(`Stack with id ${stackId} not found`);
    }
}
