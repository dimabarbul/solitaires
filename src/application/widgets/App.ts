import CardDto from '../../core/dto/CardDto';
import CardsDispositionDto from '../../core/dto/CardsDispositionDto';
import Card from './Card';
import Base from './Base';
import Row from './Row';
import GameService from '../GameService';
import CardPositionType from '../../core/CardPositionType';
import CardMovedEvent from '../../core/events/CardMovedEvent';

export default class App {
    private readonly _root: HTMLElement;
    // private readonly _cardsCount: number;
    private readonly _bases: Base[] = new Array(4);
    private readonly _rows: Row[] = new Array(8);

    constructor(private readonly _gameService: GameService, rootElementId: string/*, cardsCount: number*/) {
        this._root = document.getElementById(rootElementId)
            || (() => {
                throw new Error(`Element with id ${rootElementId} not found`);
            })();
        this.initEvents();
        // this._cardsCount = cardsCount;
    }

    public createLayout(cardsDisposition: CardsDispositionDto): void {
        this.createStacks(cardsDisposition);
    }

    private createStacks(cardsDisposition: CardsDispositionDto): void {
        for (let i = 0; i < cardsDisposition.bases.length; i++) {
            const cardStackElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardStackElement);

            const cardWidgets: Card[] = this.createCards(cardsDisposition.bases[i].cards);

            this._bases[i] = new Base(this._gameService, cardStackElement, i, cardWidgets);
        }

        for (let i = 0; i < cardsDisposition.rows.length; i++) {
            const cardStackElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardStackElement);

            const cardWidgets: Card[] = this.createCards(cardsDisposition.rows[i].cards);

            this._rows[i] = new Row(this._gameService, cardStackElement, i, cardWidgets);
        }
    }

    private createCards(cards: CardDto[]): Card[] {
        const cardWidgets: Card[] = new Array(cards.length);
        for (let i = 0; i < cards.length; i++) {
            const cardElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardElement);
            cardWidgets[i] = new Card(this._gameService, cardElement, cards[i]);
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