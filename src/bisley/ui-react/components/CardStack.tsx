import * as React from 'react';
import Card from './Card';
import Point3D from '../../../shared/domain/Point3D';
import CardModel from '../models/CardModel';
import { ClassHelper } from '../../../shared/ui/ClassHelper';

interface ICardStackProps {
    index: number
    type: string
    cards: readonly CardModel[]
    direction: CardStackDirection
    onCardDoubleClick(cardId: number): void
    onCardClick(cardId: number): void
    onStackClick(): void
}

interface ICardStackState {
    cards: CardModel[]
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
    private static readonly _yDelta: number = 130;
    private static readonly _baseZLevel: number = 0;

    public constructor(props: ICardStackProps) {
        super(props);

        this.state = {
            cards: props.cards.slice(0, props.cards.length),
        };
    }

    private get className(): string {
        return ClassHelper.stack(this.props.type, this.props.index);
    }

    public render(): React.ReactElement {
        return (
            <div
                className={this.className}
                onClick={this.onClick.bind(this)}
            >
                {
                    this.props.cards
                        .map((c: CardModel, index: number) =>
                            <Card
                                key={'card' + c.card.id.toString()}
                                card={c}
                                point={this.getCardPosition(index)}
                                onClick={(): void => this.props.onCardClick(c.card.id)}
                                onDoubleClick={(): void => this.props.onCardDoubleClick(c.card.id)}/>)
                }
            </div>
        );
    }

    public getCardPosition(index: number): Point3D {
        return new Point3D(
            this.getXDelta(index),
            this.getYDelta(index),
            this.getZLevel(index)
        );
    }

    private onClick(): void {
        if (this.props.cards.length === 0) {
            this.props.onStackClick();
        }
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
