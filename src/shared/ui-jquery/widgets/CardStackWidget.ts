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
    private static readonly xDelta: number = 25;
    private static readonly yDelta: number = 25;
    private static readonly baseZLevel: number = 0

    private readonly position: Point3D;

    public constructor(
        private readonly element: HTMLElement,
        private readonly index: number,
        private readonly id: number,
        private readonly type: string,
        private readonly direction: CardStackDirection,
        private readonly cards: CardWidget[],
        private readonly isDroppable: boolean,
        private readonly onCardDropped: (cardId: number, stackId: number) => void
    ) {
        this.initElement();

        const clientRect: DOMRect = this.element.getBoundingClientRect();
        this.position = new Point3D(
            clientRect.left + window.scrollX,
            clientRect.top + window.scrollY,
            CardStackWidget.baseZLevel
        );

        if (isDroppable) {
            this.makeDroppable();
        }
    }

    public get isEmpty(): boolean {
        return this.cards.length === 0;
    }

    public pushCard(card: CardWidget): void {
        this.cards.push(card);
    }

    public popCard(): CardWidget {
        return this.cards.pop()
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
        const cardIndex = this.cards.findIndex(c => c === cardWidget);

        cardWidget.move(this.getCardPosition(cardIndex));
    }

    protected getElementClassName(): string {
        return ClassHelper.stack(this.type, this.index);
    }

    protected initElement(): void {
        this.element.className = this.getElementClassName();
        this.element.style.zIndex = CardStackWidget.baseZLevel.toString();
    }

    private getWidget(cardId: number): CardWidget {
        return this.cards.find(c => c.cardId === cardId)
            ?? ((): never => {
                throw new Error(`Card widget for card ${cardId} not found`);
            })();
    }

    private getXDelta(): number {
        switch (this.direction) {
            case CardStackDirection.Left:
                return -CardStackWidget.xDelta;
            case CardStackDirection.Right:
                return CardStackWidget.xDelta;
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
                return CardStackWidget.yDelta;
            case CardStackDirection.Bottom:
                return -CardStackWidget.yDelta;
        }

        throw new Error(`Unexpected direction ${this.direction}`);
    }

    private makeDroppable(): void {
        const $element = $(this.element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCardId: number = parseInt(ui.draggable.data('cardId'));

            this.onCardDropped(droppedCardId, this.id);
        });
    }

    private getCardPosition(index: number): Point3D {
        return new Point3D(
            this.position.x + index * this.getXDelta(),
            this.position.y + index * this.getYDelta(),
            index + 1 + CardStackWidget.baseZLevel
        );
    }
}
