import * as React from 'react';
import CardStack, { CardStackDirection } from '../../../shared/ui-react/components/CardStack';
import GameService from '../../application/GameService';
import CardsDispositionDto from '../../../shared/domain/dto/CardsDispositionDto';
import CardMovedEvent from '../../domain/events/CardMovedEvent';
import Congratulations from '../../../shared/ui-react/components/Congratulations';
import CardStackType from '../../domain/CardStackType';
import CardModel from '../../../shared/ui-react/models/CardModel';
import { from } from 'linq-to-typescript';
import { ClassHelper } from '../../../shared/ui/ClassHelper';

interface IAppProps {
    gameService: GameService
}

interface IAppState {
    isUndoDisabled: boolean
    isRedoDisabled: boolean
    isGameFinished: boolean
    cardsDisposition: CardsDispositionDto<CardStackType>
    selectedCardId: number | null
}

export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps) {
        super(props);

        this.state = {
            isUndoDisabled: true,
            isRedoDisabled: true,
            isGameFinished: false,
            cardsDisposition: props.gameService.getCardsDisposition(),
            selectedCardId: null,
        };

        this.initEvents();
    }

    public render(): React.ReactElement {
        if (this.state.isGameFinished) {
            return <Congratulations />;
        }

        const cardsDisposition: CardsDispositionDto<CardStackType> = this.state.cardsDisposition;

        return (
            <div>
                <button className={ClassHelper.undo} onClick={this.onUndoClick.bind(this)} disabled={this.state.isUndoDisabled} />
                <button className={ClassHelper.redo} onClick={this.onRedoClick.bind(this)} disabled={this.state.isRedoDisabled} />
                {
                    from(cardsDisposition.stacks)
                        .groupBy(s => s.type)
                        .selectMany(g =>
                            g.select((s, index) => (
                                <CardStack
                                    key={'card-stack-' + s.id.toString()}
                                    index={index}
                                    type={CardStackType[s.type].toString()}
                                    cards={s.cards.map(c => new CardModel(c, c.id === this.state.selectedCardId))}
                                    direction={s.type === CardStackType.Column ? CardStackDirection.Bottom : CardStackDirection.None}
                                    onStackClick={this.onStackClick.bind(this, s.id)}
                                    onCardClick={this.onCardClick.bind(this)}
                                    onCardDoubleClick={this.onCardDoubleClick.bind(this)} />
                            )))
                }
            </div>
        );
    }

    private onStackClick(stackId: number): void {
        if (this.state.selectedCardId === null) {
            return;
        }

        if (this.props.gameService.canMoveCardToStack(this.state.selectedCardId, stackId)) {
            this.props.gameService.moveCardToStack(this.state.selectedCardId, stackId);
        }

        this.setState({
            selectedCardId: null,
        });
    }

    private onCardClick(cardId: number): void {
        if (this.state.selectedCardId === null) {
            if (!this.props.gameService.canMoveCard(cardId)) {
                return;
            }

            this.setState({
                selectedCardId: cardId,
            });

            return;
        }

        if (this.props.gameService.canMoveCardToCard(this.state.selectedCardId, cardId)) {
            this.props.gameService.moveCardToCard(this.state.selectedCardId, cardId);
        }

        this.setState({
            selectedCardId: null,
        });
    }

    private onCardDoubleClick(cardId: number): void {
        if (this.props.gameService.canMoveCardToAnyFoundation(cardId)) {
            this.props.gameService.moveCardToAnyFoundation(cardId);
        }

        if (this.state.selectedCardId !== null) {
            this.setState({
                selectedCardId: null,
            });
        }
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
