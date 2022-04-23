import Game from '../domain/Game';
import EventHandler from '../../shared/libs/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../../shared/domain/dto/CardsDispositionDto';
import Card from '../../shared/domain/Card';
import History from '../../shared/libs/History';
import { ICommand } from '../../shared/libs/Commands';
import CardPosition from '../domain/CardPosition';
import CardStackType from '../domain/CardStackType';

export default class GameService {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    private game: Game|null = null;
    private readonly history: History = new History();

    public get startedGame(): Game {
        if (this.game === null) {
            throw new Error('Game is not initialized');
        }

        return this.game;
    }

    public start(cards: readonly Card[]): void {
        this.game = new Game(cards);
        this.history.clear();
        this.initEvents();
    }

    public getCardsDisposition(): CardsDispositionDto<CardStackType> {
        return this.startedGame.getCardsDisposition();
    }

    public canMoveCard(cardId: number): boolean {
        return this.startedGame.canMove(cardId);
    }

    public canMoveCardToCard(sourceCardId: number, targetCardId: number): boolean {
        if (!this.canMoveCard(sourceCardId)) {
            return false;
        }

        const targetCardPosition: CardPosition = this.getCardPosition(targetCardId);

        return this.startedGame.canMoveCardToStack(sourceCardId, targetCardPosition.stackId);
    }

    public canMoveCardToStack(cardId: number, stackId: number): boolean {
        return this.startedGame.canMoveCardToStack(cardId, stackId);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.startedGame.canMoveCardToAnyFoundation(cardId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetCardPosition: CardPosition = this.getCardPosition(targetCardId);
        const command: ICommand = this.startedGame.moveCardToStack(sourceCardId, targetCardPosition.stackId);
        this.history.pushCommand(command);
    }

    public moveCardToStack(cardId: number, stackId: number): void {
        const command: ICommand = this.startedGame.moveCardToStack(cardId, stackId);
        this.history.pushCommand(command);
    }

    public moveCardToAnyFoundation(cardId: number): void {
        const command: ICommand = this.startedGame.moveCardToAnyFoundation(cardId);
        this.history.pushCommand(command);
    }

    public canUndo(): boolean {
        return this.history.canMoveBack();
    }

    public canRedo(): boolean {
        return this.history.canMoveForward();
    }

    public undo(): void {
        if (!this.canUndo()) {
            throw new Error('Cannot undo');
        }

        const command: ICommand = this.history.moveBack();
        command.undo();
    }

    public redo(): void {
        if (!this.canRedo()) {
            throw new Error('Cannot redo');
        }

        const command: ICommand = this.history.moveForward();
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
        this.startedGame.onCardMoved.subscribe(this.onCardMoved.trigger.bind(this.onCardMoved));
        this.startedGame.onGameFinished.subscribe(this.onGameFinished.trigger.bind(this.onGameFinished));
        this.history.onHistoryChanged.subscribe(this.onHistoryChanged.trigger.bind(this.onHistoryChanged));
    }
}
