import Game from '../domain/Game';
import EventHandler from '../../shared/libs/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import Card from '../../shared/domain/Card';
import History from '../../shared/libs/History';
import { ICommand } from '../../shared/libs/Commands';
import CardPosition from '../domain/CardPosition';
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

    public start(cards: readonly Card[]): void {
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

        const targetCardPosition: CardPosition = this.getCardPosition(targetCardId);

        return this.game.canMoveCardToStack(sourceCardId, targetCardPosition.stackId);
    }

    public canMoveCardToStack(cardId: number, stackId: number): boolean {
        return this.game.canMoveCardToStack(cardId, stackId);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.game.canMoveCardToAnyFoundation(cardId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetCardPosition: CardPosition = this.getCardPosition(targetCardId);
        const command: ICommand = this.game.moveCardToStack(sourceCardId, targetCardPosition.stackId);
        this._history.pushCommand(command);
    }

    public moveCardToStack(cardId: number, stackId: number): void {
        const command: ICommand = this.game.moveCardToStack(cardId, stackId);
        this._history.pushCommand(command);
    }

    public moveCardToAnyFoundation(cardId: number): void {
        const command: ICommand = this.game.moveCardToAnyFoundation(cardId);
        this._history.pushCommand(command);
    }

    public canUndo(): boolean {
        return this._history.canMoveBack();
    }

    public canRedo(): boolean {
        return this._history.canMoveForward();
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

    private getCardPosition(cardId: number): CardPosition {
        const cardsDisposition: CardsDispositionDto<CardStackType> = this.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            for (const stackCard of stack.cards) {
                if (stackCard.id === cardId) {
                    return new CardPosition(stack.id);
                }
            }
        }

        throw new Error(`Card ${cardId} not found`);
    }

    private initEvents(): void {
        this.game.onCardMoved.subscribe(this.onCardMoved.trigger.bind(this.onCardMoved));
        this.game.onGameFinished.subscribe(this.onGameFinished.trigger.bind(this.onGameFinished));
        this._history.onHistoryChanged.subscribe(this.onHistoryChanged.trigger.bind(this.onHistoryChanged));
    }
}
