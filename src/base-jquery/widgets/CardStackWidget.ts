import GameService from '../../besieged-fortress/application/GameService';
import Point from '../../core/Point';
import CardWidget from './CardWidget';

export enum CardStackDirection {
    None = 0,
    Left = 1,
    Right = 2,
    Top = 3,
    Bottom = 4,
}

export default class CardStackWidget {
    private static readonly _xDelta = 25;
    private static readonly _yDelta = 25;
    private static readonly _baseZLevel = 0;

    public constructor(
        protected readonly gameService: GameService,
        protected readonly element: HTMLElement,
        protected readonly index: number,
        protected readonly direction: CardStackDirection,
        protected readonly cards: CardWidget[]
    ) {
        this.initElement();
        this.refreshCards();
    }

    public pushCard(card: CardWidget): void {
        this.cards.push(card);
        this.refreshCards();
    }

    public popCard(): CardWidget {
        const card: CardWidget = this.cards.pop()
            ?? ((): never => {
                throw new Error('No cards to pop');
            })();

        this.refreshCards();

        return card;
    }

    protected getElementClassName(): string {
        throw new Error('Method not implemented.');
    }

    protected initElement(): void {
        this.element.className = this.getElementClassName();
        this.element.style.zIndex = CardStackWidget._baseZLevel.toString();
    }

    protected refreshCards(): void {
        const topLeftCorner: Point = this.getTopLeftCorner();

        for (let i = 0; i < this.cards.length; i++){
            const card = this.cards[i];
            card.move(
                topLeftCorner.x + i * this.getXDelta(),
                topLeftCorner.y + i * this.getYDelta());
            card.bringToFront(i + 1 + CardStackWidget._baseZLevel);
            this.updateDraggableState(card, i);
        }
    }

    protected updateDraggableState(card: CardWidget, index: number): void {
        if (index === this.cards.length - 1) {
            card.enableDragAndDrop();
        } else {
            card.disableDragAndDrop();
        }
    }

    private getTopLeftCorner(): Point {
        const clientRect: DOMRect = this.element.getBoundingClientRect();

        return new Point(clientRect.left + window.scrollX, clientRect.top + window.scrollY);
    }

    private getXDelta(): number {
        switch (this.direction) {
            case CardStackDirection.Left:
                return -CardStackWidget._xDelta;
            case CardStackDirection.Right:
                return CardStackWidget._xDelta;
            case CardStackDirection.None:
            case CardStackDirection.Top:
            case CardStackDirection.Bottom:
                return 0;
        }

        throw new Error(`Unexpected direction ${this.direction}`);
    }

    private getYDelta(): number {
        switch (this.direction) {
            case CardStackDirection.None:
            case CardStackDirection.Left:
            case CardStackDirection.Right:
                return 0;
            case CardStackDirection.Top:
                return CardStackWidget._yDelta;
            case CardStackDirection.Bottom:
                return -CardStackWidget._yDelta;
        }

        throw new Error(`Unexpected direction ${this.direction}`);
    }
}
