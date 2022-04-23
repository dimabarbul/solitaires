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
    private readonly root: HTMLElement;
    private readonly stacks: { [key: number]: CardStackWidget } = {};

    private cardsDisposition: CardsDispositionDto<CardStackType>;

    public constructor(private readonly gameService: GameService, rootElementId: string) {
        this.root = document.getElementById(rootElementId)
            ?? ((): never => {
                throw new Error(`Element with id ${rootElementId} not found`);
            })();
        this.initEvents();
    }

    public createLayout(): void {
        this.cardsDisposition = this.gameService.getCardsDisposition();

        this.createUndoRedoButtons();
        this.createStacks();
    }

    private createStacks(): void {
        const groupedStacks: CardStackDto<CardStackType>[][] =
            from(this.cardsDisposition.stacks)
                .groupBy(s => s.type)
                .select(g => g.toArray())
                .toArray();

        for (const stacks of groupedStacks) {
            for (let i = 0; i < stacks.length; i++){
                const stack = stacks[i];
                const cardStackElement: HTMLDivElement = document.createElement('div');
                this.root.appendChild(cardStackElement);

                const cardWidgets: CardWidget[] = this.createCards(stack.cards);

                this.stacks[stack.id] = new CardStackWidget(
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

                this.stacks[stack.id].setCards(stack.cards);
            }
        }
    }

    private createCards(cards: readonly CardDto[]): CardWidget[] {
        const cardWidgets: CardWidget[] = new Array(cards.length);

        for (let i = 0; i < cards.length; i++) {
            const cardElement: HTMLDivElement = document.createElement('div');
            this.root.appendChild(cardElement);
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
        this.root.appendChild(undoButton);

        const redoButton = document.createElement('button');
        redoButton.disabled = true;
        redoButton.className = ClassHelper.redo;
        this.root.appendChild(redoButton);

        undoButton.addEventListener('click', this.gameService.undo.bind(this.gameService));
        redoButton.addEventListener('click', this.gameService.redo.bind(this.gameService));

        this.gameService.onHistoryChanged.subscribe(_ => {
            undoButton.disabled = !this.gameService.canUndo();
            redoButton.disabled = !this.gameService.canRedo();
        });
    }

    private initEvents(): void {
        this.gameService.onCardMoved.subscribe(this.onCardMoved.bind(this));
    }

    private onCardMoved(e: CardMovedEvent): void {
        const cardWidget = this.stacks[e.fromStackId].popCard();
        this.stacks[e.toStackId].pushCard(cardWidget);

        this.cardsDisposition = this.gameService.getCardsDisposition();

        for (const stack of this.cardsDisposition.stacks) {
            this.stacks[stack.id].setCards(stack.cards);
        }
    }

    private onCardDroppedOnRow(cardId: number, stackId: number): void {
        const sourceStackId = this.getStackIdByCardId(cardId);

        if (sourceStackId === stackId) {
            this.stacks[sourceStackId].resetCardPosition(cardId);

            return;
        }

        if (!this.stacks[stackId].isEmpty) {
            return;
        }

        if (!this.gameService.canMoveCardToEmptyRow(cardId, stackId)) {
            this.stacks[sourceStackId].resetCardPosition(cardId);

            return;
        }

        this.gameService.moveCardToEmptyRow(cardId, stackId);
    }

    private onCardDroppedOnFoundation(cardId: number, stackId: number): void {
        if (!this.gameService.canMoveCardToFoundation(cardId, stackId)) {
            this.stacks[this.getStackIdByCardId(cardId)].resetCardPosition(cardId);

            return;
        }

        this.gameService.moveCardToFoundation(cardId, stackId);
    }

    private onCardDoubleClick(cardId: number): void {
        if (this.gameService.canMoveCardToAnyFoundation(cardId)) {
            this.gameService.moveCardToAnyFoundation(cardId);
        }
    }

    private onCardDroppedOnCard(sourceCardId: number, targetCardId: number): void {
        if (!this.gameService.canMoveCardToCard(sourceCardId, targetCardId)) {
            this.stacks[this.getStackIdByCardId(sourceCardId)].resetCardPosition(sourceCardId);

            return;
        }

        this.gameService.moveCardToCard(sourceCardId, targetCardId);
    }

    private getStackIdByCardId(cardId: number): number {
        for (const stack of this.cardsDisposition.stacks) {
            for (const card of stack.cards) {
                if (card.id === cardId) {
                    return stack.id;
                }
            }
        }

        throw new Error(`Card ${cardId} not found`);
    }
}