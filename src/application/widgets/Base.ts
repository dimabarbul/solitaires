import CardStack, { CardStackDirection } from './CardStack';
import Card from './Card';
import GameService from '../GameService';
// import * as $ from 'jquery';
// import CardDto from '../../core/dto/CardDto';

export default class Base extends CardStack {

    constructor(gameService: GameService, element: HTMLDivElement, index: number, cards: Card[]) {
        super(gameService, element, index, CardStackDirection.None, cards);

        // this.makeDroppable();
    }

    protected getElementClassName(): string {
        return `base base-${this._index}`;
    }
/*
    private makeDroppable(): void {
        const $element = $(this._element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const targetCard = this._cards[this._cards.length - 1].card;
            if (!this._gameService.canMoveCardToCard(CardDto.fromString(ui.draggable.data('card')), targetCard)) {
                ui.draggable.animate({
                    left: ui.draggable.data('originalLeft'),
                    top: ui.draggable.data('originalTop'),
                });

                return;
            }

            this._gameService.moveCardToCard(CardDto.fromString(ui.draggable.data('card')), targetCard);
        });
    }*/
}