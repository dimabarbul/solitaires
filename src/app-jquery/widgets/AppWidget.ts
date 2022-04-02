import RowWidget from './RowWidget';
import BaseWidget from './BaseWidget';
import CardDto from '../../domain/dto/CardDto';
import GameService from '../../application/GameService';
import CardPositionType from '../../domain/CardPositionType';
import CardMovedEvent from '../../domain/events/CardMovedEvent';
import CardsDispositionDto from '../../domain/dto/CardsDispositionDto';
import CardWidget from './CardWidget';

export default class AppWidget {
    private readonly _root: HTMLElement;
    private readonly _bases: BaseWidget[] = new Array(4);
    private readonly _rows: RowWidget[] = new Array(8);

    constructor(private readonly _gameService: GameService, rootElementId: string) {
        this._root = document.getElementById(rootElementId)
            || (() => {
                throw new Error(`Element with id ${rootElementId} not found`);
            })();
        this.initEvents();
    }

    public createLayout(cardsDisposition: CardsDispositionDto): void {
        this.createStacks(cardsDisposition);
    }

    private createStacks(cardsDisposition: CardsDispositionDto): void {
        for (let i = 0; i < cardsDisposition.bases.length; i++) {
            const cardStackElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardStackElement);

            const cardWidgets: CardWidget[] = this.createCards(cardsDisposition.bases[i].cards);

            this._bases[i] = new BaseWidget(this._gameService, cardStackElement, i, cardWidgets);
        }

        for (let i = 0; i < cardsDisposition.rows.length; i++) {
            const cardStackElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardStackElement);

            const cardWidgets: CardWidget[] = this.createCards(cardsDisposition.rows[i].cards);

            this._rows[i] = new RowWidget(this._gameService, cardStackElement, i, cardWidgets);
        }
    }

    private createCards(cards: CardDto[]): CardWidget[] {
        const cardWidgets: CardWidget[] = new Array(cards.length);
        for (let i = 0; i < cards.length; i++) {
            const cardElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardElement);
            cardWidgets[i] = new CardWidget(this._gameService, cardElement, cards[i]);
        }

        return cardWidgets;
    }

    private initEvents(): void {
        this._gameService.onCardMoved.subscribe((e: CardMovedEvent): void => {
            const cardWidget = this._rows[e.from.positionIndex].popCard();

            if (e.to.position === CardPositionType.Base) {
                this._bases[e.to.positionIndex].pushCard(cardWidget);
            } else {
                this._rows[e.to.positionIndex].pushCard(cardWidget);
            }
        });
    }
}