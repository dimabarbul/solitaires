import Game from '../domain/Game';
import EventHandler from '../../shared/libs/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../../shared/domain/dto/CardsDispositionDto';
import Card from '../../shared/domain/Card';
import History from '../../shared/libs/History';
import { ICommand } from '../../shared/libs/Commands';
import CardStackType from '../domain/CardStackType';
import GameState from './dto/GameState';

export default class GameService {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    private game: Game|null = null;
    private readonly history: History = new History();

    private get startedGame(): Game {
        if (this.game === null) {
            throw new Error('Game is not initialized');
        }

        return this.game;
    }

    public start(cards: Card[]): void {
        this.game = new Game(cards);
        this.history.clear();
        this.initEvents();
    }

    public getGameState(): GameState {
        const cardsDisposition = this.startedGame.getCardsDisposition();
        
        return new GameState(this.getOrderViolations(cardsDisposition), cardsDisposition);
    }

    public canMoveCard(cardId: number): boolean {
        return this.startedGame.canMove(cardId);
    }

    public canMoveCardToCard(sourceCardId: number, targetCardId: number): boolean {
        if (!this.canMoveCard(sourceCardId)) {
            return false;
        }

        const targetStackId = this.getCardStackId(targetCardId);

        return this.startedGame.canMoveCardToStack(sourceCardId, targetStackId);
    }

    public canMoveCardToEmptyRow(cardId: number, stackId: number): boolean {
        return this.isStackEmpty(stackId)
            && this.startedGame.canMoveCardToStack(cardId, stackId);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.startedGame.canMoveCardToAnyFoundation(cardId);
    }

    public canMoveCardToFoundation(cardId: number, foundationId: number): boolean {
        return this.startedGame.canMoveCardToStack(cardId, foundationId);
    }

    public moveCardToCard(sourceCardId: number, targetCardId: number): void {
        const targetStackId = this.getCardStackId(targetCardId);
        const command = this.startedGame.moveCardToStack(sourceCardId, targetStackId);

        this.history.pushCommand(command);
    }

    public moveCardToEmptyRow(cardId: number, stackId: number): void {
        if (!this.isStackEmpty(stackId)) {
            throw new Error(`Stack ${stackId} is not empty`);
        }
        
        const command: ICommand = this.startedGame.moveCardToStack(cardId, stackId);
        this.history.pushCommand(command);
    }

    public moveCardToAnyFoundation(cardId: number): void {
        const command: ICommand = this.startedGame.moveCardToAnyFoundation(cardId);
        this.history.pushCommand(command);
    }

    public moveCardToFoundation(cardId: number, foundationId: number): void {
        const command: ICommand = this.startedGame.moveCardToStack(cardId, foundationId);
        this.history.pushCommand(command);
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

    public canUndo(): boolean {
        return this.history.canMoveBack();
    }

    public canRedo(): boolean {
        return this.history.canMoveForward();
    }

    public autoBuild(): void {
        let movedAnyCard: boolean;
        
        do {
            movedAnyCard = false;
            
            const cardsDisposition = this.startedGame.getCardsDisposition();
            
            for (const stack of cardsDisposition.stacks) {
                for (const card of stack.cards) {
                    if (this.canMoveCardToAnyFoundation(card.id)) {
                        this.moveCardToAnyFoundation(card.id);
                        movedAnyCard = true;
                    }
                }
            }
        } while (movedAnyCard);
    }

    private getCardStackId(cardId: number): number {
        const cardsDisposition = this.startedGame.getCardsDisposition();

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
        this.startedGame.onCardMoved.subscribe(this.onCardMoved.trigger.bind(this.onCardMoved));
        this.startedGame.onGameFinished.subscribe(this.onGameFinished.trigger.bind(this.onGameFinished));
        this.history.onHistoryChanged.subscribe(this.onHistoryChanged.trigger.bind(this.onHistoryChanged));
    }
    
    private isStackEmpty(stackId: number): boolean {
        const cardsDisposition = this.startedGame.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            if (stack.id === stackId) {
                return stack.cards.length === 0;
            }
        }

        throw new Error(`Stack with id ${stackId} not found`);
    }

    private getOrderViolations(cardsDisposition: CardsDispositionDto<CardStackType>): number {
        let violations = 0;

        for (const stack of cardsDisposition.stacks) {
            if (stack.type !== CardStackType.Row) {
                continue;
            }
            
            for (let i = 0; i < stack.cards.length; i++) {
                for (let j = i + 1; j < stack.cards.length; j++) {
                    if (stack.cards[i].value < stack.cards[j].value) {
                        violations++;
                    }
                }
            }
        }

        return violations;
    }
}
