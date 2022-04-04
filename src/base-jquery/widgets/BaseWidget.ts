import GameService from '../../besieged-fortress/application/GameService';
import CardStackWidget, { CardStackDirection } from './CardStackWidget';
import CardWidget from './CardWidget';
import * as $ from 'jquery';
import CardDto from '../../besieged-fortress/domain/dto/CardDto';

export default class BaseWidget extends CardStackWidget {

    constructor(gameService: GameService, element: HTMLElement, index: number, cards: CardWidget[]) {
        super(gameService, element, index, CardStackDirection.None, cards);

        this.makeDroppable();
    }

    protected getElementClassName(): string {
        return `base base-${this._index}`;
    }

    protected updateDraggableState(card: CardWidget, index: number) {
        card.disableDragAndDrop();
    }

    private makeDroppable(): void {
        const $element = $(this._element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCard: CardDto = CardDto.fromString(ui.draggable.data('card'));

            if (!this._gameService.canMoveCardToBase(droppedCard, this._index)) {
                ui.draggable.css('left', ui.draggable.data('originalLeft'));
                ui.draggable.css('top', ui.draggable.data('originalTop'));

                return;
            }

            this._gameService.moveCardToBase(droppedCard);
        });
    }
}
