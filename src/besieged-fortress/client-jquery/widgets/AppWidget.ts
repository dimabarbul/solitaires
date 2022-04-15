import CardStackWidget from '../../../base-jquery/widgets/CardStackWidget';
import RowWidget from '../../../base-jquery/widgets/RowWidget';
import CardStackDto from '../../../shared-kernel/dto/CardStackDto';
import CardDto from '../../../shared-kernel/dto/CardDto';
import FoundationWidget from '../../../base-jquery/widgets/FoundationWidget';
import { from } from 'linq-to-typescript';
import CardWidget from '../../../base-jquery/widgets/CardWidget';
import GameService from '../../application/GameService';
import CardsDispositionDto from '../../domain/dto/CardsDispositionDto';
import CardStackType from '../../domain/CardStackType';
import CardMovedEvent from '../../domain/events/CardMovedEvent';

export default class AppWidget {
    private readonly _root: HTMLElement;
    private readonly _stacks: { [key: number]: CardStackWidget } = {};

    public constructor(private readonly _gameService: GameService, rootElementId: string) {
        this._root = document.getElementById(rootElementId)
            ?? ((): never => {
                throw new Error(`Element with id ${rootElementId} not found`);
            })();
        this.initEvents();
    }

    public createLayout(): void {
        this.createUndoRedoButtons();
        this.createStacks(this._gameService.getCardsDisposition());
    }

    private createStacks(cardsDisposition: CardsDispositionDto): void {
        const groupedStacks: CardStackDto<CardStackType>[][] =
            from(cardsDisposition.stacks)
                .groupBy(s => s.type)
                .select(g => g.toArray())
                .toArray();

        for (const stacks of groupedStacks) {
            for (let i = 0; i < stacks.length; i++){
                const stack = stacks[i];
                const cardStackElement: HTMLDivElement = document.createElement('div');
                this._root.appendChild(cardStackElement);

                const cardWidgets: CardWidget[] = this.createCards(stack.cards);

                this._stacks[stack.id] = stack.type === CardStackType.Foundation ?
                    new FoundationWidget(this._gameService, cardStackElement, i, stack.id, cardWidgets) :
                    new RowWidget(this._gameService, cardStackElement, i, stack.id, cardWidgets);
            }
        }
    }

    private createCards(cards: readonly CardDto[]): CardWidget[] {
        const cardWidgets: CardWidget[] = new Array(cards.length);

        for (let i = 0; i < cards.length; i++) {
            const cardElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardElement);
            cardWidgets[i] = new CardWidget(this._gameService, cardElement, cards[i]);
        }

        return cardWidgets;
    }

    private createUndoRedoButtons(): void {
        const undoButton = document.createElement('button');
        undoButton.disabled = true;
        undoButton.className = 'undo';
        this._root.appendChild(undoButton);

        const redoButton = document.createElement('button');
        redoButton.disabled = true;
        redoButton.className = 'redo';
        this._root.appendChild(redoButton);

        undoButton.addEventListener('click', () => {
            this._gameService.undo();
        });
        redoButton.addEventListener('click', () => {
            this._gameService.redo();
        });
        this._gameService.onHistoryChanged.subscribe(_ => {
            undoButton.disabled = !this._gameService.canUndo();
            redoButton.disabled = !this._gameService.canRedo();
        });
    }

    private initEvents(): void {
        this._gameService.onCardMoved.subscribe((e: CardMovedEvent): void => {
            const cardWidget = this._stacks[e.fromStackId].popCard();

            this._stacks[e.toStackId].pushCard(cardWidget);
        });
    }
}