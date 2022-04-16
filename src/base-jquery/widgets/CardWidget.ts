import GameService from '../../besieged-fortress/application/GameService';
import CardDto from '../../shared-kernel/dto/CardDto';
import { ClassHelper } from '../../shared-ui/ClassHelper';
import * as $ from 'jquery';
import 'jqueryui';

export default class CardWidget {
    public constructor(
        private readonly _gameService: GameService,
        private readonly _element: HTMLElement,
        private readonly _card: CardDto
    ) {
        this.initElement();
        this.initEvents();
        this.initDragAndDrop();
    }

    public get card(): CardDto {
        return this._card;
    }

    public move(x: number, y: number): void {
        this._element.style.left = `${x}px`;
        this._element.style.top = `${y}px`;
    }

    public bringToFront(zLevel: number): void {
        this._element.style.zIndex = zLevel.toString();
    }

    public enableDragAndDrop(): void  {
        $(this._element).draggable('enable');
        $(this._element).droppable('enable');
    }

    public disableDragAndDrop(): void  {
        $(this._element).draggable('disable');
        $(this._element).droppable('disable');
    }

    private initElement(): void {
        this._element.className = ClassHelper.card(this._card);
        this._element.setAttribute('data-card-id', this._card.id.toString());
    }

    private initDragAndDrop(): void {
        const $element = $(this._element);
        $element.draggable({
            revert: (dropped: boolean): boolean => !dropped,
            revertDuration: 0,
            disabled: true,
            stack: '.playing-card',
        });
        $element.on('dragstart', (event, ui) => {
            const position = ui.helper.position();
            $element.data('originalLeft', Math.round(position.left));
            $element.data('originalTop', Math.round(position.top));
        });

        $element.droppable({});
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCardId = parseInt(ui.draggable.data('cardId'));

            if (!this._gameService.canMoveCardToCard(droppedCardId, this._card.id)) {
                ui.draggable.css('left', ui.draggable.data('originalLeft'));
                ui.draggable.css('top', ui.draggable.data('originalTop'));

                return;
            }

            this._gameService.moveCardToCard(droppedCardId, this._card.id);
            event.stopPropagation();
        });
    }

    private initEvents(): void {
        this._element.addEventListener('dblclick', (_): void => {
            if (this._gameService.canMoveCardToFoundation(this._card.id)) {
                this._gameService.moveCardToFoundation(this._card.id);
            }
        });
    }
}
