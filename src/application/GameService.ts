import Game from '../domain/Game';
import EventHandler from '../core/EventHandler';
import CardMovedEvent from '../domain/events/CardMovedEvent';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import CardDto from '../domain/dto/CardDto';
import RowDto from '../domain/dto/RowDto';
import CardPositionType from '../domain/CardPositionType';
import BaseDto from '../domain/dto/BaseDto';
import CardPosition from '../domain/CardPosition';
import Card from '../domain/Card';
import GameFinishedEvent from '../domain/events/GameFinishedEvent';

export default class GameService {
    private _game: Game|null = null;

    public get game(): Game {
        if (this._game === null) {
            throw new Error('Game is not initialized');
        }

        return this._game;
    }

    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<GameFinishedEvent> = new EventHandler<GameFinishedEvent>();

    public start(cards: Card[]): void {
        this._game = new Game();
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

            if (sourceCard.suit !== targetCard.suit) {
                return false;
            }

            return this.game.canMoveCardToAnyBase(sourceCardPosition.positionIndex);
        }

        return this.game.canMoveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
    }

    public moveCardToCard(sourceCard: CardDto, targetCard: CardDto) {
        if (!this.canMoveCardToCard(sourceCard, targetCard)) {
            throw new Error(`Cannot move card to card: ${sourceCard.toString()} => ${targetCard.toString()}`);
        }

        const sourceCardPosition: CardPosition = this.getCardPosition(sourceCard);
        const targetCardPosition: CardPosition = this.getCardPosition(targetCard);

        if (targetCardPosition.position === CardPositionType.Base) {
            this.game.moveCardToBase(sourceCardPosition.positionIndex);
        } else {
            this.game.moveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
        }
    }

    public moveCardToEmptyRow(cardDto: CardDto, rowNumber: number): void {
        this.game.moveCardToRow(this.getCardPosition(cardDto).positionIndex, rowNumber);
    }

    public canMoveCardToEmptyRow(cardDto: CardDto, rowNumber: number): boolean {
        return this.getCardPosition(cardDto).positionIndex !== rowNumber;
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
    }

    public canMoveCardToBase(card: CardDto, baseIndex: number|null = null): boolean {
        if (baseIndex !== null) {
            return this.game.canMoveCardToBase(this.getCardPosition(card).positionIndex, baseIndex);
        }

        return this.game.canMoveCardToAnyBase(this.getCardPosition(card).positionIndex);
    }

    public moveCardToBase(card: CardDto): void {
        this.game.moveCardToBase(this.getCardPosition(card).positionIndex);
    }
}
