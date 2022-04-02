import CardStack, { CardStackDirection } from './CardStack';
import Card from './Card';
import GameService from '../GameService';
import * as $ from 'jquery';
import CardDto from '../../core/dto/CardDto';

export default class Row extends CardStack {
    constructor(gameService: GameService, element: HTMLDivElement, index: number, cards: Card[]) {
        super(gameService, element, index, index < 4 ? CardStackDirection.Left : CardStackDirection.Right, cards);
    }

    protected initElement() {
        super.initElement();

        this.makeDroppable();
    }

    protected getElementClassName(): string {
        return `card-row card-row-${this._index}`;
    }

    protected refreshCards(): void {
        super.refreshCards();

        if (this._cards.length > 0) {
            $(this._element).droppable('disable');
        } else {
            $(this._element).droppable('enable');
        }
    }

    private makeDroppable(): void {
        const $element = $(this._element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCard: CardDto = CardDto.fromString(ui.draggable.data('card'));

            // console.log('drop on row', this._cards.length > 0 ? this._cards[0].card.toString() : '', droppedCard.toString());
            // if (this._cards.some((card: Card): boolean => card.card.toString() === droppedCard.toString())) {
            //     ui.draggable.animate({
            //         left: ui.draggable.data('originalLeft'),
            //         top: ui.draggable.data('originalTop'),
            //     });
            //
            //     return;
            // }

            if (this._cards.length > 0) {
                return;
            }

            if (!this._gameService.canMoveCardToEmptyRow(droppedCard, this._index)) {
                ui.draggable.animate({
                    left: ui.draggable.data('originalLeft'),
                    top: ui.draggable.data('originalTop'),
                });

                return;
            }

            this._gameService.moveCardToEmptyRow(droppedCard, this._index);
        });
    }
}