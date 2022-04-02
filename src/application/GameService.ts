import Game from '../core/Game';
import Deck from '../core/Deck';
import CardsDispositionDto from '../core/dto/CardsDispositionDto';
import CardDto from '../core/dto/CardDto';
import RowDto from '../core/dto/RowDto';
import BaseDto from '../core/dto/BaseDto';
import CardPosition from '../core/CardPosition';
import CardPositionType from '../core/CardPositionType';
import EventHandler from '../core/EventHandler';
import CardMovedEvent from '../core/events/CardMovedEvent';

export default class GameService {
    private readonly _game: Game;
    private readonly _deck: Deck;

    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();

    constructor() {
        this._game = new Game();
        this._deck = Deck.getShortDeckInReverseOrder();
        this.initEvents();
    }

    // public get cardsCount(): number {
    //     return this._deck.cards.length;
    // }

    public start(): void {
        this._deck.shuffle();
        this._game.start(this._deck.cards);
    }

    public getCardsDisposition(): CardsDispositionDto {
        return this._game.getCardsDisposition();
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

            return this._game.canMoveCardToBase(sourceCardPosition.positionIndex);
        }

        return this._game.canMoveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
    }

    public moveCardToCard(sourceCard: CardDto, targetCard: CardDto) {
        if (!this.canMoveCardToCard(sourceCard, targetCard)) {
            throw new Error(`Cannot move card to card: ${sourceCard.toString()} => ${targetCard.toString()}`);
        }

        const sourceCardPosition: CardPosition = this.getCardPosition(sourceCard);
        const targetCardPosition: CardPosition = this.getCardPosition(targetCard);

        if (targetCardPosition.position === CardPositionType.Base) {
            this._game.moveCardToBase(sourceCardPosition.positionIndex);
        } else {
            this._game.moveCardToRow(sourceCardPosition.positionIndex, targetCardPosition.positionIndex);
        }
    }

    public moveCardToEmptyRow(cardDto: CardDto, rowNumber: number): void {
        this._game.moveCardToRow(this.getCardPosition(cardDto).positionIndex, rowNumber);
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
        this._game.onCardMoved.subscribe((e: CardMovedEvent): void => {
            this.onCardMoved.trigger(e);
        });
    }
}
