import CardDto from '../../besieged-fortress/domain/dto/CardDto';
import GameService from '../../besieged-fortress/application/GameService';
import CardStackWidget, { CardStackDirection } from './CardStackWidget';
import CardWidget from './CardWidget';
import * as $ from 'jquery';
import 'jqueryui';

export default class RowWidget extends CardStackWidget {
    public constructor(gameService: GameService, element: HTMLElement, index: number, cards: CardWidget[]) {
        super(gameService, element, index, index < 4 ? CardStackDirection.Left : CardStackDirection.Right, cards);
    }

    protected initElement(): void {
        super.initElement();

        this.makeDroppable();
    }

    protected getElementClassName(): string {
        return `card-row card-row-${this.index}`;
    }

    protected refreshCards(): void {
        super.refreshCards();

        if (this.cards.length > 0) {
            $(this.element).droppable('disable');
        } else {
            $(this.element).droppable('enable');
        }
    }

    private makeDroppable(): void {
        const $element = $(this.element);
        $element.droppable();
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCard: CardDto = CardDto.fromString(ui.draggable.data('card'));

            if (this.cards.length > 0) {
                return;
            }

            if (!this.gameService.canMoveCardToEmptyRow(droppedCard, this.index)) {
                ui.draggable.css('left', ui.draggable.data('originalLeft'));
                ui.draggable.css('top', ui.draggable.data('originalTop'));

                return;
            }

            this.gameService.moveCardToEmptyRow(droppedCard, this.index);
        });
    }
}