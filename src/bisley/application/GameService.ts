import Game from '../domain/Game';
import EventHandler from '../../core/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import Card from '../../core/Card';
import History from '../../core/History';
import ICommand from '../../core/ICommand';
import CardDto from '../domain/dto/CardDto';
import CardPosition from '../domain/CardPosition';
import CardStackDto from '../domain/dto/CardStackDto';
import CardStackType from '../domain/CardStackType';

/* eslint-disable */

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

        return this.game.canMoveToStack(sourceCardId, targetCardPosition.stackId);
    }

    public canMoveCardToStack(cardId: number, stackId: number): boolean {
        return this.game.canMoveToStack(cardId, stackId);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.game.canMoveToAnyFoundation(cardId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetCardPosition: CardPosition = this.getCardPosition(targetCardId);
        const command: ICommand = this.game.moveToStack(sourceCardId, targetCardPosition.stackId);
        this._history.pushCommand(command);
    }

    public moveCardToStack(cardId: number, stackId: number): void {
        const command: ICommand = this.game.moveToStack(cardId, stackId);
        this._history.pushCommand(command);
    }

    public moveCardToAnyFoundation(cardId: number): void {
        const command: ICommand = this.game.moveToAnyFoundation(cardId);
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

        for (let i = 0; i < cardsDisposition.stacks.length; i++) {
            const stack: CardStackDto<CardStackType> = cardsDisposition.stacks[i];

            for (let j = 0; j < stack.cards.length; j++) {
                const stackCard: CardDto = stack.cards[j];

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
