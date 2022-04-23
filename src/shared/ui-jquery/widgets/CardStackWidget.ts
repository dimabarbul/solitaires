import CardWidget from './CardWidget';
import * as $ from 'jquery';
import { ClassHelper } from '../../ui/ClassHelper';
import CardDto from '../../domain/dto/CardDto';
import { Point3D } from '../../libs/Points';

export enum CardStackDirection {
    None = 0,
    Left = 1,
    Right = 2,
    Top = 3,
    Bottom = 4,
}

export default class CardStackWidget {
    private static readonly _xDelta: number = 25;
    private static readonly _yDelta: number = 25;
    private static readonly _baseZLevel: number = 0

    private readonly _position: Point3D;

    public constructor(
        private readonly _element: HTMLElement,
        private readonly _index: number,
        private readonly _id: number,
        private readonly _type: string,
        private readonly _direction: CardStackDirection,
        private readonly _cards: CardWidget[],
        private readonly _isDroppable: boolean,
        private readonly _onCardDropped: (cardId: number, stackId: number) => void
    ) {
        this.initElement();

        const clientRect: DOMRect = this._element.getBoundingClientRect();
        this._position = new Point3D(
            clientRect.left + window.scrollX,
            clientRect.top + window.scrollY,
            CardStackWidget._baseZLevel
        );

        if (_isDroppable) {
            this.makeDroppable();
        }
    }

    public get isEmpty(): boolean {
        return this._cards.length === 0;
    }

    public pushCard(card: CardWidget): void {
        this._cards.push(card);
    }

    public popCard(): CardWidget {
        return this._cards.pop()
            ?? ((): never => {
                throw new Error('No cards to pop');
            })();
    }

    public setCards(cards: readonly CardDto[]): void {
        for (let i = 0; i < cards.length; i++){
            const card = cards[i];
            const cardWidget = this.getWidget(card.id);
            cardWidget.setCard(card);

            cardWidget.move(this.getCardPosition(i));
        }
    }

    public resetCardPosition(cardId: number): void {
        const cardWidget = this.getWidget(cardId);
        const cardIndex = this._cards.findIndex(c => c === cardWidget);

        cardWidget.move(this.getCardPosition(cardIndex));
    }

    protected getElementClassName(): string {
        return ClassHelper.stack(this._type, this._index);
    }

    protected initElement(): void {
        this._element.className = this.getElementClassName();
        this._element.style.zIndex = CardStackWidget._baseZLevel.toString();
    }

    private getWidget(cardId: number): CardWidget {
        return this._cards.find(c => c.card.id === cardId)
            ?? ((): never => {
                throw new Error(`Card widget for card ${cardId} not found`);
            })();
    }

    private getXDelta(): number {
        switch (this._direction) {
            case CardStackDirection.Left:
                return -CardStackWidget._xDelta;
            case CardStackDirection.Right:
                return CardStackWidget._xDelta;
            case CardStackDirection.None:
            case CardStackDirection.Top:
            case CardStackDirection.Bottom:
                return 0;
        }

        throw new Error(`Unexpected direction ${this._direction}`);
    }

    private getYDelta(): number {
        switch (this._direction) {
            case CardStackDirection.None:
            case CardStackDirection.Left:
            case CardStackDirection.Right:
                return 0;
            case CardStackDirection.Top:
                return CardStackWidget._yDelta;
            case CardStackDirection.Bottom:
                return -CardStackWidget._yDelta;
        }

        throw new Error(`Unexpected direction ${this._direction}`);
    }

    private makeDroppable(): void {
        const $element = $(this._element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCardId: number = parseInt(ui.draggable.data('cardId'));

            this._onCardDropped(droppedCardId, this._id);
        });
    }

    private getCardPosition(index: number): Point3D {
        return new Point3D(
            this._position.x + index * this.getXDelta(),
            this._position.y + index * this.getYDelta(),
            index + 1 + CardStackWidget._baseZLevel
        );
    }
}
