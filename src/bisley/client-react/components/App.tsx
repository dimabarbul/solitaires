import * as React from 'react';
import { ReactElement, RefObject } from 'react';
import CardStack, { CardStackDirection } from './CardStack';
import GameService from '../../application/GameService';
import CardsDispositionDto from '../../domain/dto/CardsDispositionDto';
import Card from './Card';
import CardMovedEvent from '../../domain/events/CardMovedEvent';
import Congratulations from './Congratulations';
import CardStackType from '../../domain/CardStackType';

interface IAppProps {
    gameService: GameService
}

interface IAppState {
    isUndoDisabled: boolean
    isRedoDisabled: boolean
    isGameFinished: boolean
}

export default class App extends React.Component<IAppProps, IAppState> {
    private _cardComponents: { [key: number]: RefObject<Card> } = {};
    private _stackComponents: { [key: number]: RefObject<CardStack> } = {};

    public constructor(props: IAppProps) {
        super(props);

        this.state = {
            isUndoDisabled: true,
            isRedoDisabled: true,
            isGameFinished: false,
        };

        this.initEvents();
    }

    public componentDidMount(): void {
        const cardsDisposition: CardsDispositionDto<CardStackType> = this.props.gameService.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            const stackComponent: CardStack = this.getStackComponent(stack.id);

            for (const card of stack.cards) {
                const cardComponent: Card = this.getCardComponent(card.id);

                cardComponent.moveToStack(stackComponent);
            }
        }
    }

    public render(): React.ReactElement {
        if (this.state.isGameFinished) {
            return <Congratulations />;
        }

        const cardsDisposition: CardsDispositionDto<CardStackType> = this.props.gameService.getCardsDisposition();

        return <div>
            <button className="undo" onClick={this.onUndoClick.bind(this)} disabled={this.state.isUndoDisabled} />
            <button className="redo" onClick={this.onRedoClick.bind(this)} disabled={this.state.isRedoDisabled} />
            {
                cardsDisposition.stacks.map(s => {
                    const ref: RefObject<CardStack> = s.id in this._stackComponents ?
                        this._stackComponents[s.id] :
                        React.createRef<CardStack>();
                    const reactElement: ReactElement =
                        <CardStack
                            key={'card-stack' + s.id.toString()}
                            ref={ref}
                            id={s.id}
                            cards={s.cards}
                            direction={s.type === CardStackType.Column ? CardStackDirection.Bottom : CardStackDirection.None}
                            onDropped={this.onCardDroppedOnStack.bind(this)} />;

                    this._stackComponents[s.id] = ref;

                    return reactElement;
                })
            }
            {
                cardsDisposition.stacks
                    .map(s => s.cards
                        .map(c => {
                            const ref: React.RefObject<Card> = c.id in this._cardComponents ?
                                this._cardComponents[c.id] :
                                React.createRef<Card>();
                            const reactElement: ReactElement =
                                <Card
                                    key={'card' + c.id.toString()}
                                    ref={ref}
                                    card={c}
                                    onDropped={this.onCardDroppedOnCard.bind(this)}
                                    onDoubleClick={this.onCardDoubleClick.bind(this)} />;

                            this._cardComponents[c.id] = ref;

                            return reactElement;
                        }))
            }
        </div>;
    }

    private onCardDroppedOnCard(droppedCardId: number, targetCardId: number): void {
        if (this.props.gameService.canMoveCardToCard(droppedCardId, targetCardId)) {
            this.props.gameService.moveCardToCard(droppedCardId, targetCardId);
        } else {
            this.getCardComponent(droppedCardId).restorePosition();
        }
    }

    private onCardDoubleClick(cardId: number): void {
        if (this.props.gameService.canMoveCardToAnyFoundation(cardId)) {
            this.props.gameService.moveCardToAnyFoundation(cardId);
        } else {
            this.getCardComponent(cardId).restorePosition();
        }
    }

    private onCardDroppedOnStack(droppedCardId: number, stackId: number): void {
        if (this.props.gameService.canMoveCardToStack(droppedCardId, stackId)) {
            this.props.gameService.moveCardToStack(droppedCardId, stackId);
        } else {
            this.getCardComponent(droppedCardId).restorePosition();
        }
    }

    private initEvents(): void {
        this.props.gameService.onCardMoved.subscribe((e: CardMovedEvent) => {
            this.moveCard(e.fromStackId, e.toStackId);
            this.updateCardsAvailability()
        });
        // this.props.gameService.onHistoryChanged.subscribe(() => {
        //     this.setState({
        //         isUndoDisabled: !this.props.gameService.canUndo(),
        //         isRedoDisabled: !this.props.gameService.canRedo(),
        //     });
        // });
    }

    private moveCard(fromStackId: number, toStackId: number): void {
        const fromStack = this.getStackComponent(fromStackId);
        const toStack = this.getStackComponent(toStackId);

        const card = fromStack.popCard();
        toStack.pushCard(card);

        this.getCardComponent(card.id).moveToStack(toStack);
    }

    private getCardComponent(cardId: number): Card {
        return this._cardComponents[cardId].current
            ?? ((): never => {
                throw new Error(`Component for card ${cardId} not found`);
            })();
    }

    private getStackComponent(stackId: number): CardStack {
        return this._stackComponents[stackId].current
            ?? ((): never => {
                throw new Error(`Component for stack ${stackId} not found`);
            })();
    }

    private updateCardsAvailability(): void {
        const cardsDisposition: CardsDispositionDto<CardStackType> = this.props.gameService.getCardsDisposition();

        for (const stack of cardsDisposition.stacks) {
            for (const card of stack.cards) {
                this.getCardComponent(card.id).setAvailable(card.canBeMoved);
            }
        }
    }

    private onUndoClick(): void {
        this.props.gameService.undo();
    }

    private onRedoClick(): void {
        this.props.gameService.redo();
    }
}
