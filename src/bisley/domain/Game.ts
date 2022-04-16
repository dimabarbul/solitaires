import Card from '../../shared/domain/Card';
import CardPosition from './CardPosition';
import ICommand from '../../shared/domain/ICommand';
import AceFoundation from './AceFoundation';
import CardSuit from '../../shared/domain/CardSuit';
import KingFoundation from './KingFoundation';
import Column from './Column';
import CardValue from '../../shared/domain/CardValue';
import EventHandler from '../../shared/domain/EventHandler';
import CardMovedEvent from './events/CardMovedEvent';
import Command from '../../shared/domain/Command';
import CardStack from '../../shared/domain/CardStack';
import CardsDispositionDto from './dto/CardsDispositionDto';
import CardStackType from './CardStackType';

export default class Game {
    public onCardMoved: EventHandler<CardMovedEvent> = new EventHandler<CardMovedEvent>();
    public readonly onGameFinished: EventHandler<void> = new EventHandler<void>();

    private readonly _aceFoundations: AceFoundation[] = new Array(4);
    private readonly _kingFoundations: KingFoundation[] = new Array(4);
    private readonly _columns: Column[] = new Array(13);

    private _stacks: { [key: number]: CardStack<CardStackType> } = {};

    public start(cards: readonly Card[]): void {
        if (cards.length !== 52) {
            throw new Error(`Invalid number of cards: expected 52, got ${cards.length}`);
        }

        this.initEvents();
        this.initFoundations(cards);
        this.initColumns(cards);
        this.fillStacks();
    }

    public canMove(cardId: number): boolean {
        for (const key in this._stacks) {
            if (this._stacks[key].isCardAvailable(cardId)) {
                return true;
            }
        }

        return false;
    }

    public canMoveToStack(cardId: number, stackId: number): boolean {
        return this.canMove(cardId) && this._stacks[stackId].canPush(this.getCard(cardId));
    }

    public moveToStack(cardId: number, stackId: number): ICommand {
        if (!this.canMoveToStack(cardId, stackId)) {
            throw new Error(`Cannot move card ${cardId} to stack ${stackId}`);
        }

        const cardPosition: CardPosition = this.getCardPosition(cardId);
        const command: ICommand = new Command(
            this.moveFromStackToStack.bind(this, cardPosition.stackId, stackId, true),
            this.moveFromStackToStack.bind(this, stackId, cardPosition.stackId, false)
        );

        this.moveFromStackToStack(cardPosition.stackId, stackId, true);

        return command;
    }

    public canMoveToAnyFoundation(cardId: number): boolean {
        return this.canMove(cardId)
            && (this.canMoveToAnyAceFoundation(cardId) || this.canMoveToAnyKingFoundation(cardId));
    }

    public moveToAnyFoundation(cardId: number): ICommand {
        if (!this.canMove(cardId)) {
            throw new Error(`Cannot move card ${cardId.toString()}`);
        }

        const aceStackId: number = this.getAceStackId(cardId);

        if (this.canMoveToStack(cardId, aceStackId)) {
            return this.moveToStack(cardId, aceStackId);
        }

        const kingStackId: number = this.getKingStackId(cardId);

        if (this.canMoveToStack(cardId, kingStackId)) {
            return this.moveToStack(cardId, kingStackId);
        }

        throw new Error(`Cannot move card ${cardId.toString()} to any foundation`);
    }

    public getCardsDisposition(): CardsDispositionDto<CardStackType> {
        return new CardsDispositionDto(
            Object.values(this._stacks).map(f => f.mapToDto()));
    }

    public isGameFinished(): boolean {
        return this._columns.every(c => c.isEmpty);
    }

    private initFoundations(cards: readonly Card[]): void {
        const suits: CardSuit[] = [ CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades ];

        for (let i = 0; i < suits.length; i++) {
            this._aceFoundations[i] = new AceFoundation(
                i,
                suits[i],
                cards.find(c => c.suit === suits[i] && c.value === CardValue.Ace)
                    ?? ((): never => {
                        throw new Error(`Cannot find ace card for suit ${suits[i]}`);
                    })()
            );
            this._kingFoundations[i] = new KingFoundation(i + 4, suits[i]);
        }
    }

    private initColumns(cards: readonly Card[]): void {
        const cardsWithoutAces = cards.filter((card: Card) => card.value !== CardValue.Ace);

        for (let i = 0; i < 4; i++) {
            this._columns[i] = new Column(i + 8, cardsWithoutAces.slice(i * 3, i * 3 + 3));
        }

        for (let i = 0; i < 9; i++) {
            this._columns[i + 4] = new Column(i + 12, cardsWithoutAces.slice(12 + i * 4, 12 + i * 4 + 4));
        }
    }

    private canMoveToAnyAceFoundation(cardId: number): boolean {
        for (let i = 0; i < this._aceFoundations.length; i++) {
            if (this.canMoveToAceFoundation(cardId, i)) {
                return true;
            }
        }

        return false;
    }

    private canMoveToAnyKingFoundation(cardId: number): boolean {
        for (let i = 0; i < this._kingFoundations.length; i++) {
            if (this.canMoveToKingFoundation(cardId, i)) {
                return true;
            }
        }

        return false;
    }

    private canMoveToAceFoundation(cardId: number, foundationNumber: number): boolean {
        return this._aceFoundations[foundationNumber].canPush(this.getCard(cardId));
    }

    private canMoveToKingFoundation(cardId: number, foundationNumber: number): boolean {
        return this._kingFoundations[foundationNumber].canPush(this.getCard(cardId));
    }

    private getAceStackId(cardId: number): number {
        const card = this.getCard(cardId);

        for (const item of this._aceFoundations) {
            if (item.suit === card.suit) {
                return item.id;
            }
        }

        throw new Error(`Cannot find foundation for suit ${card.suit}`);
    }

    private getKingStackId(cardId: number): number {
        const card = this.getCard(cardId);

        for (const item of this._kingFoundations) {
            if (item.suit === card.suit) {
                return item.id;
            }
        }

        throw new Error(`Cannot find foundation for suit ${card.suit}`);
    }

    private getCardPosition(cardId: number): CardPosition {
        for (const stackId in this._stacks) {
            if (this._stacks[stackId].contains(cardId)) {
                return new CardPosition(parseInt(stackId));
            }
        }

        throw new Error(`Cannot find card ${cardId}`);
    }

    private moveFromStackToStack(fromStackId: number, toStackId: number, validateCard: boolean): void {
        const fromStack = this._stacks[fromStackId];
        const toStack = this._stacks[toStackId];

        const card: Card = fromStack.pop();
        toStack.push(card, validateCard);

        this.onCardMoved.trigger(new CardMovedEvent(
            card.id,
            fromStackId,
            toStackId
        ));
    }

    private getCard(cardId: number): Card {
        for (const stack of Object.values(this._stacks)) {
            const card = stack.findCard(cardId);

            if (card !== null) {
                return card;
            }
        }

        throw new Error(`Card with id ${cardId} not found`);
    }

    private fillStacks(): void {
        this._stacks = {};
        const stacks = this._aceFoundations.map(f => <CardStack<CardStackType>>f)
            .concat(this._kingFoundations)
            .concat(this._columns);

        for (const stack of stacks) {
            this._stacks[stack.id] = stack;
        }
    }

    private initEvents(): void {
        this.onCardMoved.subscribe(_ => {
            this.checkIfGameIsFinished();
        })
    }

    private checkIfGameIsFinished(): void {
        if (this.isGameFinished()) {
            this.onGameFinished.trigger();
        }
    }
}