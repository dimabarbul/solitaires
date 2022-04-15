import Game from '../domain/Game';
import EventHandler from '../../shared-kernel/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import Card from '../../shared-kernel/Card';
import History from '../../shared-kernel/History';
import ICommand from '../../shared-kernel/ICommand';

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
        this._game = new Game();
        this._history.clear();
        this.initEvents();
        this.game.start(cards);
    }

    public getCardsDisposition(): CardsDispositionDto {
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
        return this.game.canMoveCardToStack(cardId, stackId);
    }

    public canMoveCardToFoundation(cardId: number, foundationId: number|null = null): boolean {
        if (foundationId !== null) {
            return this.game.canMoveCardToStack(cardId, foundationId);
        }

        return this.game.canMoveCardToAnyFoundation(cardId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetStackId = this.getCardStackId(targetCardId);
        const command = this.game.moveCardToStack(sourceCardId, targetStackId);

        this._history.pushCommand(command);
    }

    public moveCardToEmptyRow(cardId: number, stackId: number): void {
        const command: ICommand = this.game.moveCardToStack(cardId, stackId);
        this._history.pushCommand(command);
    }

    public moveCardToFoundation(cardId: number): void {
        const command: ICommand = this.game.moveCardToAnyFoundation(cardId);
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
        const cardsDisposition: CardsDispositionDto = this.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            for (const baseCard of stack.cards) {
                if (baseCard.id === cardId) {
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
}
