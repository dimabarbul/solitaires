import Game from '../domain/Game';
import EventHandler from '../../core/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import CardDto from '../domain/dto/CardDto';
import RowDto from '../domain/dto/RowDto';
import CardPositionType from '../domain/CardPositionType';
import BaseDto from '../domain/dto/BaseDto';
import CardPosition from '../domain/CardPosition';
import Card from '../../core/Card';
import History from '../../core/History';
import ICommand from '../../core/ICommand';

export default class GameService {
    private _game: Game|null = null;
    private readonly _history: History = new History();

    public get game(): Game {
        if (this._game === null) {
            throw new Error('Game is not initialized');
        }

        return this._game;
    }

    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    public start(cards: Card[]): void {
        this._game = new Game();
        this._history.clear();
        this.initEvents();
        this.game.start(cards);
    }

    public getCardsDisposition(): CardsDispositionDto {
        return this.game.getCardsDisposition();
    }

    public canMoveCard(card: CardDto): boolean {
        const cardPosition: CardPosition = this.getCardPosition(card);

        switch (cardPosition.position) {
            case CardPositionType.Base:
                return false;
            case CardPositionType.Row:
                const cardsDisposition = this.getCardsDisposition();

                return cardPosition.index === cardsDisposition.rows[cardPosition.positionIndex].cards.length - 1;
            default: throw new Error(`Unexpected card position type ${cardPosition.position}`);
        }
    }

    public canMoveCardToCard(sourceCard: CardDto, targetCard: CardDto): boolean {
        if (!this.canMoveCard(sourceCard)) {
            return false;
        }

        const sourceCardPosition: CardPosition = this.getCardPosition(sourceCard);
        const targetCardPosition: CardPosition = this.getCardPosition(targetCard);

        if (sourceCardPosition.position === CardPositionType.Base) {
            throw new Error(`Cannot move card from base: ${sourceCard.toString()}`);
        }

        if (targetCardPosition.position === CardPositionType.Base) {
            return this.game.canMoveCardToBase(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
        }

        return this.game.canMoveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
    }

    public canMoveCardToEmptyRow(cardDto: CardDto, rowNumber: number): boolean {
        return this.getCardPosition(cardDto).positionIndex !== rowNumber;
    }

    public canMoveCardToBase(card: CardDto, baseIndex: number|null = null): boolean {
        if (baseIndex !== null) {
            return this.game.canMoveCardToBase(this.getCardPosition(card).positionIndex, baseIndex);
        }

        return this.game.canMoveCardToAnyBase(this.getCardPosition(card).positionIndex);
    }

    public moveCardToCard(sourceCard: CardDto, targetCard: CardDto) {
        const sourceCardPosition: CardPosition = this.getCardPosition(sourceCard);
        const targetCardPosition: CardPosition = this.getCardPosition(targetCard);

        let command: ICommand;
        if (targetCardPosition.position === CardPositionType.Base) {
            command = this.game.moveCardToBase(sourceCardPosition.positionIndex);
        } else {
            command = this.game.moveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
        }

        this._history.pushCommand(command);
    }

    public moveCardToEmptyRow(cardDto: CardDto, rowNumber: number): void {
        const command: ICommand = this.game.moveCardToRow(this.getCardPosition(cardDto).positionIndex, rowNumber);
        this._history.pushCommand(command);
    }

    public moveCardToBase(card: CardDto): void {
        const command: ICommand = this.game.moveCardToBase(this.getCardPosition(card).positionIndex);
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

    private getCardPosition(card: CardDto): CardPosition {
        const cardsDisposition: CardsDispositionDto = this.getCardsDisposition();

        for (let i = 0; i < cardsDisposition.bases.length; i++) {
            const base: BaseDto = cardsDisposition.bases[i];

            for (let j = 0; j < base.cards.length; j++) {
                const baseCard: CardDto = base.cards[j];

                if (baseCard.equalsTo(card)) {
                    return new CardPosition(CardPositionType.Base, i, j);
                }
            }
        }

        for (let i = 0; i < cardsDisposition.rows.length; i++) {
            const row: RowDto = cardsDisposition.rows[i];

            for (let j = 0; j < row.cards.length; j++) {
                const rowCard: CardDto = row.cards[j];

                if (rowCard.equalsTo(card)) {
                    return new CardPosition(CardPositionType.Row, i, j);
                }
            }
        }

        throw new Error(`Card ${card.value} ${card.suit} not found`);
    }

    private initEvents(): void {
        this.game.onCardMoved.subscribe(this.onCardMoved.trigger.bind(this.onCardMoved));
        this.game.onGameFinished.subscribe(this.onGameFinished.trigger.bind(this.onGameFinished));
        this._history.onHistoryChanged.subscribe(this.onHistoryChanged.trigger.bind(this.onHistoryChanged));
    }
}
