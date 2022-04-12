import * as React from 'react';
import CardStack, { CardStackDirection } from './CardStack';
import GameService from '../../application/GameService';
import CardsDispositionDto from '../../domain/dto/CardsDispositionDto';
import CardMovedEvent from '../../domain/events/CardMovedEvent';
import Congratulations from './Congratulations';
import CardStackType from '../../domain/CardStackType';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface IAppProps {
    gameService: GameService
}

interface IAppState {
    isUndoDisabled: boolean
    isRedoDisabled: boolean
    isGameFinished: boolean
    cardsDisposition: CardsDispositionDto<CardStackType>
}

export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps) {
        super(props);

        this.state = {
            isUndoDisabled: true,
            isRedoDisabled: true,
            isGameFinished: false,
            cardsDisposition: props.gameService.getCardsDisposition(),
        };

        this.initEvents();
    }

    public render(): React.ReactElement {
        if (this.state.isGameFinished) {
            return <Congratulations />;
        }

        const cardsDisposition: CardsDispositionDto<CardStackType> = this.state.cardsDisposition;

        return <DndProvider backend={HTML5Backend}>
            <div>
                <button className="undo" onClick={this.onUndoClick.bind(this)} disabled={this.state.isUndoDisabled} />
                <button className="redo" onClick={this.onRedoClick.bind(this)} disabled={this.state.isRedoDisabled} />
                {
                    cardsDisposition.stacks.map(s =>
                        <CardStack
                            key={'card-stack' + s.id.toString()}
                            id={s.id}
                            cards={s.cards}
                            direction={s.type === CardStackType.Column ? CardStackDirection.Bottom : CardStackDirection.None}
                            canDropCardOnCard={this.canDropCardOnCard.bind(this)}
                            canDropCardOnStack={this.canDropCardOnStack.bind(this)}
                            onCardDroppedOnStack={this.onCardDroppedOnStack.bind(this)}
                            onCardDroppedOnCard={this.onCardDroppedOnCard.bind(this)}
                            onCardDoubleClick={this.onCardDoubleClick.bind(this)} />
                    )
                }
            </div>
        </DndProvider>;
    }

    private onCardDroppedOnCard(droppedCardId: number, targetCardId: number): void {
        if (this.props.gameService.canMoveCardToCard(droppedCardId, targetCardId)) {
            this.props.gameService.moveCardToCard(droppedCardId, targetCardId);
        }
    }

    private onCardDoubleClick(cardId: number): void {
        if (this.props.gameService.canMoveCardToAnyFoundation(cardId)) {
            this.props.gameService.moveCardToAnyFoundation(cardId);
        }
    }

    private onCardDroppedOnStack(droppedCardId: number, stackId: number): void {
        if (this.props.gameService.canMoveCardToStack(droppedCardId, stackId)) {
            this.props.gameService.moveCardToStack(droppedCardId, stackId);
        }
    }

    private canDropCardOnStack(cardId: number, stackId: number): boolean {
        return this.props.gameService.canMoveCardToStack(cardId, stackId);
    }

    private canDropCardOnCard(droppedCardId: number, targetCardId: number): boolean {
        return this.props.gameService.canMoveCardToCard(droppedCardId, targetCardId);
    }

    private initEvents(): void {
        this.props.gameService.onCardMoved.subscribe((_: CardMovedEvent) => {
            this.setState({
                cardsDisposition: this.props.gameService.getCardsDisposition(),
            });
        });
        this.props.gameService.onHistoryChanged.subscribe(() => {
            this.setState({
                isUndoDisabled: !this.props.gameService.canUndo(),
                isRedoDisabled: !this.props.gameService.canRedo(),
            });
        });
        this.props.gameService.onGameFinished.subscribe(() => {
            this.setState({
                isGameFinished: true,
            });
        });
    }

    private onUndoClick(): void {
        this.props.gameService.undo();
    }

    private onRedoClick(): void {
        this.props.gameService.redo();
    }
}
