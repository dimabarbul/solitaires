import CardStackWidget, { CardStackDirection } from '../../../shared/ui-jquery/widgets/CardStackWidget';
import CardStackDto from '../../../shared/domain/dto/CardStackDto';
import CardDto from '../../../shared/domain/dto/CardDto';
import { from } from 'linq-to-typescript';
import CardWidget from '../../../shared/ui-jquery/widgets/CardWidget';
import GameService from '../../application/GameService';
import CardsDispositionDto from '../../../shared/domain/dto/CardsDispositionDto';
import CardStackType from '../../domain/CardStackType';
import CardMovedEvent from '../../domain/events/CardMovedEvent';
import { ClassHelper } from '../../../shared/ui/ClassHelper';

export default class AppWidget {
    private readonly _root: HTMLElement;
    private readonly _stacks: { [key: number]: CardStackWidget } = {};

    private _cardsDisposition: CardsDispositionDto<CardStackType>;

    public constructor(private readonly _gameService: GameService, rootElementId: string) {
        this._root = document.getElementById(rootElementId)
            ?? ((): never => {
                throw new Error(`Element with id ${rootElementId} not found`);
            })();
        this.initEvents();
    }

    public createLayout(): void {
        this._cardsDisposition = this._gameService.getCardsDisposition();

        this.createUndoRedoButtons();
        this.createStacks();
    }

    private createStacks(): void {
        const groupedStacks: CardStackDto<CardStackType>[][] =
            from(this._cardsDisposition.stacks)
                .groupBy(s => s.type)
                .select(g => g.toArray())
                .toArray();

        for (const stacks of groupedStacks) {
            for (let i = 0; i < stacks.length; i++){
                const stack = stacks[i];
                const cardStackElement: HTMLDivElement = document.createElement('div');
                this._root.appendChild(cardStackElement);

                const cardWidgets: CardWidget[] = this.createCards(stack.cards);

                this._stacks[stack.id] = new CardStackWidget(
                    cardStackElement,
                    i,
                    stack.id,
                    CardStackType[stack.type].toString(),
                    stack.type === CardStackType.Foundation ?
                        CardStackDirection.None :
                        (i < 4 ? CardStackDirection.Left : CardStackDirection.Right),
                    cardWidgets,
                    true,
                    stack.type === CardStackType.Foundation ?
                        this.onCardDroppedOnFoundation.bind(this) :
                        this.onCardDroppedOnRow.bind(this)
                );

                this._stacks[stack.id].setCards(stack.cards);
            }
        }
    }

    private createCards(cards: readonly CardDto[]): CardWidget[] {
        const cardWidgets: CardWidget[] = new Array(cards.length);

        for (let i = 0; i < cards.length; i++) {
            const cardElement: HTMLDivElement = document.createElement('div');
            this._root.appendChild(cardElement);
            cardWidgets[i] = new CardWidget(
                cardElement,
                cards[i],
                this.onCardDoubleClick.bind(this, cards[i].id),
                this.onCardDroppedOnCard.bind(this));
        }

        return cardWidgets;
    }

    private createUndoRedoButtons(): void {
        const undoButton = document.createElement('button');
        undoButton.disabled = true;
        undoButton.className = ClassHelper.undo;
        this._root.appendChild(undoButton);

        const redoButton = document.createElement('button');
        redoButton.disabled = true;
        redoButton.className = ClassHelper.redo;
        this._root.appendChild(redoButton);

        undoButton.addEventListener('click', this._gameService.undo.bind(this._gameService));
        redoButton.addEventListener('click', this._gameService.redo.bind(this._gameService));

        this._gameService.onHistoryChanged.subscribe(_ => {
            undoButton.disabled = !this._gameService.canUndo();
            redoButton.disabled = !this._gameService.canRedo();
        });
    }

    private initEvents(): void {
        this._gameService.onCardMoved.subscribe(this.onCardMoved.bind(this));
    }

    private onCardMoved(e: CardMovedEvent): void {
        const cardWidget = this._stacks[e.fromStackId].popCard();
        this._stacks[e.toStackId].pushCard(cardWidget);

        this._cardsDisposition = this._gameService.getCardsDisposition();

        for (const stack of this._cardsDisposition.stacks) {
            this._stacks[stack.id].setCards(stack.cards);
        }
    }

    private onCardDroppedOnRow(cardId: number, stackId: number): void {
        const sourceStackId = this.getStackIdByCardId(cardId);

        if (sourceStackId === stackId) {
            this._stacks[sourceStackId].resetCardPosition(cardId);

            return;
        }

        if (!this._stacks[stackId].isEmpty) {
            return;
        }

        if (!this._gameService.canMoveCardToEmptyRow(cardId, stackId)) {
            this._stacks[sourceStackId].resetCardPosition(cardId);

            return;
        }

        this._gameService.moveCardToEmptyRow(cardId, stackId);
    }

    private onCardDroppedOnFoundation(cardId: number, stackId: number): void {
        if (!this._gameService.canMoveCardToFoundation(cardId, stackId)) {
            this._stacks[this.getStackIdByCardId(cardId)].resetCardPosition(cardId);

            return;
        }

        this._gameService.moveCardToFoundation(cardId, stackId);
    }

    private onCardDoubleClick(cardId: number): void {
        if (this._gameService.canMoveCardToAnyFoundation(cardId)) {
            this._gameService.moveCardToAnyFoundation(cardId);
        }
    }

    private onCardDroppedOnCard(sourceCardId: number, targetCardId: number): void {
        if (!this._gameService.canMoveCardToCard(sourceCardId, targetCardId)) {
            this._stacks[this.getStackIdByCardId(sourceCardId)].resetCardPosition(sourceCardId);

            return;
        }

        this._gameService.moveCardToCard(sourceCardId, targetCardId);
    }

    private getStackIdByCardId(cardId: number): number {
        for (const stack of this._cardsDisposition.stacks) {
            for (const card of stack.cards) {
                if (card.id === cardId) {
                    return stack.id;
                }
            }
        }

        throw new Error(`Card ${cardId} not found`);
    }
}