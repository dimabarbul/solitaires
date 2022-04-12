import * as React from 'react';
import CardDto from '../../domain/dto/CardDto';
import Card from './Card';
import { ReactElement } from 'react';
import Point3D from '../../../core/Point3D';
import Draggable from './Draggable';
import DropZone from './DropZone';

interface ICardStackProps {
    id: number
    cards: readonly CardDto[]
    direction: CardStackDirection
    canDropCardOnCard(droppedCardId: number, targetCardId: number): boolean
    canDropCardOnStack(cardId: number, stackId: number): boolean
    onCardDroppedOnStack(droppedCardId: number, stackId: number): void
    onCardDroppedOnCard(droppedCardId: number, targetCardId: number): void
    onCardDoubleClick(cardId: number): void
}

interface ICardStackState {
    cards: CardDto[]
}

export enum CardStackDirection {
    None = 0,
    Left = 1,
    Right = 2,
    Top = 3,
    Bottom = 4,
}

export default class CardStack extends React.Component<ICardStackProps, ICardStackState> {
    private static readonly _xDelta: number = 25;
    private static readonly _yDelta: number = 25;
    private static readonly _baseZLevel: number = 0;

    public constructor(props: ICardStackProps) {
        super(props);

        this.state = {
            cards: props.cards.slice(0, props.cards.length),
        };
    }

    private get className(): string {
        return `card-stack card-stack-${this.props.id}`;
    }

    public render(): React.ReactElement {
        return <DropZone
            acceptType="card"
            canDrop={(droppedCardId: string): boolean => this.props.canDropCardOnStack(parseInt(droppedCardId), this.props.id)}
            onDrop={(droppedCardId: string): void => this.props.onCardDroppedOnStack(parseInt(droppedCardId), this.props.id)}
        >
            <div className={this.className}>
                {
                    this.props.cards
                        .map((c: CardDto, index: number) => {
                            const cardElement = <Card
                                key={'card' + c.id.toString()}
                                card={c}
                                point={this.getCardPosition(index)}
                                onDoubleClick={this.props.onCardDoubleClick} />;
                            const reactElement: ReactElement =
                                c.isInteractable ?
                                    <DropZone
                                        key={'drop-zone-' + c.id.toString()}
                                        acceptType="card"
                                        canDrop={(droppedCardId: string): boolean => this.props.canDropCardOnCard.bind(this, parseInt(droppedCardId), c.id)}
                                        onDrop={(droppedCardId: string): void => this.props.onCardDroppedOnCard.bind(this, parseInt(droppedCardId), c.id)}
                                    >
                                        <Draggable
                                            key={'draggable-' + c.id.toString()}
                                            id={c.id.toString()}
                                            type="card"
                                        >
                                            {cardElement}
                                        </Draggable>
                                    </DropZone>:
                                    cardElement;

                            return reactElement;
                        })
                }
            </div>
        </DropZone>;
    }

    public getCardPosition(index: number): Point3D {
        return new Point3D(
            this.getXDelta(index),
            this.getYDelta(index),
            this.getZLevel(index)
        );
    }

    private getXDelta(index: number): number {
        switch (this.props.direction) {
            case CardStackDirection.Left:
                return -CardStack._xDelta * index;
            case CardStackDirection.Right:
                return CardStack._xDelta * index;
            case CardStackDirection.None:
            case CardStackDirection.Top:
            case CardStackDirection.Bottom:
                return 0;
        }

        throw new Error(`Unexpected direction ${this.props.direction}`);
    }

    private getYDelta(index: number): number {
        switch (this.props.direction) {
            case CardStackDirection.None:
            case CardStackDirection.Left:
            case CardStackDirection.Right:
                return 0;
            case CardStackDirection.Top:
                return -(index * CardStack._yDelta);
            case CardStackDirection.Bottom:
                return index * CardStack._yDelta;
        }

        throw new Error(`Unexpected direction ${this.props.direction}`);
    }

    private getZLevel(index: number): number {
        return CardStack._baseZLevel + index + 1;
    }
}
