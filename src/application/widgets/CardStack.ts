﻿import Card from './Card';
import Point from '../Point';
import GameService from '../GameService';

export enum CardStackDirection {
    None,
    Left,
    Right,
    Top,
    Bottom,
}

export default class CardStack {
    private static readonly XDelta = 25;
    private static readonly YDelta = 25;
    private static readonly BaseZLevel = 0;

    constructor(
        protected readonly _gameService: GameService,
        protected readonly _element: HTMLDivElement,
        protected readonly _index: number,
        protected readonly _direction: CardStackDirection,
        protected readonly _cards: Card[]
    ) {
        this.initElement();
        this.refreshCards();
    }

    public pushCard(card: Card): void {
        this._cards.push(card);
        this.refreshCards();
    }

    public popCard(): Card {
        const card: Card = this._cards.pop()
            || (() => { throw new Error('No cards to pop'); })();

        this.refreshCards();

        return card;
    }

    protected getElementClassName(): string {
        throw new Error('Method not implemented.');
    }

    protected initElement(): void {
        this._element.className = this.getElementClassName();
        this._element.style.zIndex = CardStack.BaseZLevel.toString();
    }

    protected refreshCards(): void {
        const topLeftCorner: Point = this.getTopLeftCorner();
        for (let i = 0; i < this._cards.length; i++){
            let card = this._cards[i];
            card.move(
                topLeftCorner.x + i * this.getXDelta(),
                topLeftCorner.y + i * this.getYDelta());
            card.bringToFront(i + 1 + CardStack.BaseZLevel);
            this.updateDraggableState(card, i);
        }
    }

    private getTopLeftCorner(): Point {
        const clientRect: DOMRect = this._element.getBoundingClientRect();

        return new Point(clientRect.left + window.scrollX, clientRect.top + window.scrollY);
    }

    private getXDelta(): number {
        switch (this._direction) {
            case CardStackDirection.Left:
                return -CardStack.XDelta;
            case CardStackDirection.Right:
                return CardStack.XDelta;
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
                return CardStack.YDelta;
            case CardStackDirection.Bottom:
                return -CardStack.YDelta;
        }

        throw new Error(`Unexpected direction ${this._direction}`);
    }

    private updateDraggableState(card: Card, index: number): void {
        if (index === this._cards.length - 1) {
            card.enableDragAndDrop();
        } else {
            card.disableDragAndDrop();
        }
    }
}