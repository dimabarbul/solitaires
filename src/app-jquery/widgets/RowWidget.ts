import CardDto from '../../domain/dto/CardDto';
import GameService from '../../application/GameService';
import CardStackWidget, { CardStackDirection } from './CardStackWidget';
import CardWidget from './CardWidget';
import * as $ from 'jquery';
import 'jqueryui';

export default class RowWidget extends CardStackWidget {
    constructor(gameService: GameService, element: HTMLDivElement, index: number, cards: CardWidget[]) {
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