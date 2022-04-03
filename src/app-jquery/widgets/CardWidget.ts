import GameService from '../../application/GameService';
import CardDto from '../../domain/dto/CardDto';
import { valueToString } from '../../domain/CardValue';
import { suitToString } from '../../domain/CardSuit';
import * as $ from 'jquery';
import 'jqueryui';

export default class CardWidget {
    constructor(
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

    private initElement(): void {
        this._element.className = this.getClassName();
        this._element.setAttribute('data-card', this._card.toString());
    }

    public move(x: number, y: number): void {
        this._element.style.left = `${x}px`;
        this._element.style.top = `${y}px`;
    }

    public bringToFront(zLevel: number): void {
        this._element.style.zIndex = '' + zLevel;
    }

    public enableDragAndDrop(): void  {
        $(this._element).draggable('enable');
        $(this._element).droppable('enable');
    }

    public disableDragAndDrop(): void  {
        $(this._element).draggable('disable');
        $(this._element).droppable('disable');
    }

    private getClassName(): string {
        return `playing-card card-${this.getValueClassNamePart()}-${this.getSuitClassNamePart()}`;
    }

    private getValueClassNamePart(): string {
        return valueToString(this._card.value);
    }

    private getSuitClassNamePart(): string {
        return suitToString(this._card.suit);
    }

    private initDragAndDrop(): void {
        const $element = $(this._element);
        $element.draggable({
            revert: (dropped: boolean): boolean => !dropped,
            disabled: true,
            stack: '.playing-card',
            // start: (event, ui) => {
            //     const position = ui.helper.position();
            //     $element.data('originLeft', position.left);
            //     $element.data('originTop', position.top);
            // },
        });
        $element.on('dragstart', (event, ui) => {
            const position = ui.helper.position();
            $element.data('originalLeft', Math.round(position.left));
            $element.data('originalTop', Math.round(position.top));
        });

        $element.droppable({
            // accept: ($el: JQuery): boolean => {
            //     return this._gameService.canMoveCardToCard(CardDto.fromString($el.data('card')), this._card);
            // },
        });
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            // console.log(
            //     'drop',
            //     CardDto.fromString(ui.draggable.data('card')).toString(),
            //     this._card.toString(),
            //     this._gameService.canMoveCardToCard(CardDto.fromString(ui.draggable.data('card')), this._card));
            // console.log(ui.draggable.data('originalLeft'), ui.draggable.data('originalTop'));
            if (!this._gameService.canMoveCardToCard(CardDto.fromString(ui.draggable.data('card')), this._card)) {
                ui.draggable.animate({
                    left: ui.draggable.data('originalLeft'),
                    top: ui.draggable.data('originalTop'),
                });

                return;
            }

            this._gameService.moveCardToCard(CardDto.fromString(ui.draggable.data('card')), this._card);
            event.stopPropagation();
        });
    }

    private initEvents(): void {
        this._element.addEventListener('dblclick', (event: Event): void => {
            if (this._gameService.canMoveCardToBase(this._card)) {
                this._gameService.moveCardToBase(this._card);
            }
        });
    }
}
