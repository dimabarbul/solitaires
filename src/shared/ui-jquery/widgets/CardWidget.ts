import CardDto from '../../domain/dto/CardDto';
import { ClassHelper } from '../../ui/ClassHelper';
import * as $ from 'jquery';
import 'jqueryui';
import { Point3D } from '../../libs/Points';

export default class CardWidget {
    public constructor(
        private readonly element: HTMLElement,
        private card: CardDto,
        private readonly onDoubleClick: () => void,
        private readonly onDropped: (sourceCardId: number, targetCardId: number) => void
    ) {
        this.initElement();
        this.initEvents();
        this.initDragAndDrop();
    }

    public get cardId(): number {
        return this.card.id;
    }

    public move(point: Point3D): void {
        this.element.style.left = `${point.x}px`;
        this.element.style.top = `${point.y}px`;
        this.element.style.zIndex = `${point.z}`;
    }

    public setCard(card: CardDto): void {
        if (card.isInteractable !== this.card.isInteractable) {
            if (card.isInteractable) {
                this.enableDragAndDrop();
            } else {
                this.disableDragAndDrop();
            }
        }

        this.card = card;
    }

    private enableDragAndDrop(): void  {
        $(this.element).draggable('enable');
        $(this.element).droppable('enable');
    }

    private disableDragAndDrop(): void  {
        $(this.element).draggable('disable');
        $(this.element).droppable('disable');
    }

    private initElement(): void {
        this.element.className = ClassHelper.card(this.card);
        this.element.setAttribute('data-card-id', this.card.id.toString());
    }

    private initDragAndDrop(): void {
        const $element = $(this.element);
        $element.draggable({
            revert: (dropped: boolean): boolean => !dropped,
            revertDuration: 0,
            disabled: !this.card.isInteractable,
        });
        $element.on('dragstart', () => {
            this.element.style.zIndex = '100';
        });

        $element.droppable({});
        $element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            const droppedCardId = parseInt(ui.draggable.data('cardId'));

            this.onDropped(droppedCardId, this.card.id);

            event.stopPropagation();
        });
    }

    private initEvents(): void {
        this.element.addEventListener('dblclick', (_): void => {
            this.onDoubleClick();
        });
    }
}
