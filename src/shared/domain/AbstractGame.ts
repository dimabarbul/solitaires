import EventHandler from '../libs/EventHandler';
import CardMovedEvent from '../../besieged-fortress/domain/events/CardMovedEvent';
import CardStack from './CardStack';
import { Command, ICommand } from '../libs/Commands';
import CardsDispositionDto from './dto/CardsDispositionDto';
import Card from './Card';

export default abstract class AbstractGame<TCardStackType> {
    public readonly onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();

    private stacks: { [key: number]: CardStack<TCardStackType> } = {};

    protected constructor() {
        this.initEvents();
    }

    public canMove(cardId: number): boolean {
        for (const stack of Object.values(this.stacks)) {
            if (stack.isCardAvailable(cardId)) {
                return true;
            }
        }

        return false;
    }

    public canMoveCardToStack(cardId: number, stackId: number): boolean {
        return this.canMove(cardId)
            && !this.stacks[stackId].contains(cardId)
            && this.stacks[stackId].canPush(this.getCard(cardId));
    }

    public moveCardToStack(cardId: number, stackId: number): ICommand {
        if (!this.canMoveCardToStack(cardId, stackId)) {
            throw new Error(`Cannot move card ${cardId} to stack ${stackId}`);
        }

        const sourceStackId: number = this.getCardStackId(cardId);

        const command: Command = new Command(
            this.moveCardFromStackToStack.bind(this, sourceStackId, stackId),
            this.moveCardFromStackToStack.bind(this, stackId, sourceStackId, false),
        );

        command.execute();

        return command;
    }

    public getCardsDisposition(): CardsDispositionDto<TCardStackType> {
        return new CardsDispositionDto<TCardStackType>(
            Object.values(this.stacks).map(s => s.mapToDto()));
    }

    protected checkIfGameIsFinished(): void {
        if (this.isGameFinished()) {
            this.onGameFinished.trigger();
        }
    }

    protected getCard(cardId: number): Card {
        for (const stack of Object.values(this.stacks)) {
            const card = stack.findCard(cardId);

            if (card !== null) {
                return card;
            }
        }

        throw new Error(`Cannot find card with id ${cardId}`);
    }

    protected fillStacks(stacks: CardStack<TCardStackType>[][]): void {
        this.stacks = {};

        const plainStacks = stacks.reduce((a, b) => a.concat(b), []);

        for (const stack of plainStacks) {
            this.stacks[stack.id] = stack;
        }
    }

    protected canMoveCardToStackOfType(cardId: number, allowedTypes: TCardStackType[]): boolean {
        return this.canMove(cardId)
            && Object.values(this.stacks).some(s =>
                allowedTypes.includes(s.type)
                && !s.contains(cardId)
                && s.canPush(this.getCard(cardId)));
    }

    protected moveCardToStackOfType(cardId: number, allowedTypes: TCardStackType[]): ICommand {
        if (!this.canMoveCardToStackOfType(cardId, allowedTypes)) {
            throw new Error(`Cannot move card ${cardId} to stack of type ${allowedTypes.join(', ')}`);
        }

        const sourceStackId: number = this.getCardStackId(cardId);
        const targetStackId: number = this.getCardStackIdOfType(cardId, allowedTypes);

        const command: Command = new Command(
            this.moveCardFromStackToStack.bind(this, sourceStackId, targetStackId),
            this.moveCardFromStackToStack.bind(this, targetStackId, sourceStackId, false),
        );

        command.execute();

        return command;
    }

    private moveCardFromStackToStack(sourceStackId: number, targetStackId: number, validateCard: boolean = true): void {
        const card = this.stacks[sourceStackId].pop();
        this.stacks[targetStackId].push(card, validateCard);

        this.onCardMoved.trigger(new CardMovedEvent(
            card.id,
            sourceStackId,
            targetStackId));
    }

    private getCardStackId(cardId: number): number {
        for (const stack of Object.values(this.stacks)) {
            if (stack.contains(cardId)) {
                return stack.id;
            }
        }

        throw new Error(`Cannot find card with id ${cardId}`);
    }

    private getCardStackIdOfType(cardId: number, allowedTypes: TCardStackType[]): number {
        const card = this.getCard(cardId);
        const stack = Object.values(this.stacks)
            .find(s =>
                allowedTypes.includes(s.type)
                && !s.contains(cardId)
                && s.canPush(card))
            ?? ((): never => {
                throw new Error(`Cannot find stack of type ${allowedTypes.join(', ')} to push card ${cardId}`);
            })();

        return stack.id;
    }

    private initEvents(): void {
        this.onCardMoved.subscribe(_ => {
            this.checkIfGameIsFinished();
        })
    }

    public abstract isGameFinished(): boolean;
}
