import CardDto from '../../domain/dto/CardDto';
import { ClassHelper } from '../../ui/ClassHelper';
import * as $ from 'jquery';
import 'jqueryui';
import Point3D from '../../domain/Point3D';

export default class CardWidget {
    public constructor(
        private readonly _element: HTMLElement,
        private _card: CardDto,
        private readonly _onDoubleClick: () => void,
        private readonly _onDropped: (sourceCardId: number, targetCardId: number) => void
    ) {
        this.initElement();
        this.initEvents();
        this.initDragAndDrop();
    }

    public get card(): CardDto {
        return this._card;
    }

    public move(point: Point3D): void {
        this._element.style.left = `${point.x}px`;
        this._element.style.top = `${point.y}px`;
        this._element.style.zIndex = `${point.z}`;
    }

    public setCard(card: CardDto): void {
        if (card.isInteractable !== this._card.isInteractable) {
            if (card.isInteractable) {
                this.enableDragAndDrop();
            } else {
                this.disableDragAndDrop();
            }
        }

        this._card = card;
    }

    private enableDragAndDrop(): void  {
        $(this._element).draggable('enable');
        $(this._element).droppable('enable');
    }

    private disableDragAndDrop(): void  {
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
            disabled: !this.card.isInteractable,
        });
        $element.on('dragstart', () => {
            this._element.style.zIndex = '100';
        });

        $element.droppable({});
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCardId = parseInt(ui.draggable.data('cardId'));

            this._onDropped(droppedCardId, this.card.id);

            event.stopPropagation();
        });
    }

    private initEvents(): void {
        this._element.addEventListener('dblclick', (_): void => {
            this._onDoubleClick();
        });
    }
}
