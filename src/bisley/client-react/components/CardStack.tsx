import * as React from 'react';
import CardDto from '../../domain/dto/CardDto';
import Point from '../../../core/Point';
import Point3D from '../../../core/Point3D';
import * as $ from 'jquery';

interface ICardStackProps {
    id: number
    cards: readonly CardDto[]
    direction: CardStackDirection
    onDropped(droppedCardId: number, stackId: number): void
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
    private static readonly _xDelta = 25;
    private static readonly _largeYDelta = 130;
    private static readonly _yDelta = 25;
    private static readonly _baseZLevel = 0;

    private readonly _ref: React.RefObject<HTMLDivElement>;
    private _$element: JQuery;
    private _sparseCount: number;

    public constructor(props: ICardStackProps) {
        super(props);

        console.log('creating card stack', props.id);

        this._ref = React.createRef<HTMLDivElement>();
        this.state = {
            cards: props.cards.slice(0, props.cards.length),
        };
        this._sparseCount = this.props.cards.length - 1;
    }

    private get className(): string {
        return `card-stack card-stack-${this.props.id}`;
    }

    public componentDidMount(): void {
        if (this._ref.current === null) {
            throw new Error('Ref object is null');
        }

        this._$element = $(this._ref.current);
        this._$element.droppable();
        this._$element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            this.props.onDropped(ui.draggable.data('id'), this.props.id);
        });
    }

    public componentWillUnmount(): void {
        this._$element.droppable('destroy');
    }

    public render(): React.ReactElement {
        return <div ref={this._ref} className={this.className} />;
    }

    public getCardPosition(cardId: number): Point3D {
        const topLeftCorner: Point = this.getTopLeftCorner();
        const index: number = this.findIndex(cardId);

        return new Point3D(
            topLeftCorner.x + this.getXDelta(index),
            topLeftCorner.y + this.getYDelta(index),
            this.getZLevel(index)
        );
    }

    public popCard(): CardDto {
        const card: CardDto = this.state.cards.pop()
            ?? ((): never => {
                throw new Error(`Card stack ${this.props.id} is empty`);
            })();

        this.setState({ cards: this.state.cards });

        if (this.state.cards.length - 1 < this._sparseCount) {
            // console.log('less cards than sparse count', this.state.cards.length, this._sparseCount);
            this._sparseCount = this.state.cards.length - 1;
        }

        return card;
    }

    public pushCard(card: CardDto): void {
        this.state.cards.push(card);
        this.setState({ cards: this.state.cards });
    }

    private getTopLeftCorner(): Point {
        const element: HTMLDivElement = this._ref.current
            ?? ((): never => {
                throw new Error('Card stack ref is null');
            })();
        const clientRect: DOMRect = element.getBoundingClientRect();

        return new Point(clientRect.left + window.scrollX, clientRect.top + window.scrollY);
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
        const sparseCount = Math.min(index, this._sparseCount);
        const denseCount = Math.max(index - this._sparseCount, 0);

        // console.log(`sparseCount: ${sparseCount}, denseCount: ${denseCount}`);

        switch (this.props.direction) {
            case CardStackDirection.None:
            case CardStackDirection.Left:
            case CardStackDirection.Right:
                return 0;
            case CardStackDirection.Top:
                return -(CardStack._largeYDelta * sparseCount + CardStack._yDelta * denseCount);
            case CardStackDirection.Bottom:
                return CardStack._largeYDelta * sparseCount + CardStack._yDelta * denseCount;
        }

        throw new Error(`Unexpected direction ${this.props.direction}`);
    }

    private findIndex(cardId: number): number {
        return this.state.cards.findIndex(c => c.id === cardId);
    }

    private getZLevel(index: number): number {
        return CardStack._baseZLevel + index + 1;
    }
}
