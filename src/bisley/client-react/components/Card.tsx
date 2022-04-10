import * as React from 'react';
import CardDto from '../../domain/dto/CardDto';
import { valueToString } from '../../../core/CardValue';
import { suitToString } from '../../../core/CardSuit';
import * as $ from 'jquery';
import 'jqueryui';
import CardStack from './CardStack';
import Point3D from '../../../core/Point3D';

interface ICardProps {
    card: CardDto
    onDropped(droppedCardId: number, targetCardId: number): void
    onDoubleClick(cardId: number): void
}

interface ICardState {
    style: React.CSSProperties
}

export default class Card extends React.Component<ICardProps, ICardState> {
    private readonly _ref: React.RefObject<HTMLDivElement>;
    private _$element: JQuery;
    private _lastPosition: Point3D;

    public constructor(props: ICardProps) {
        super(props);

        this._ref = React.createRef<HTMLDivElement>();
        this.state = {
            style: {
                left: 0,
                top: 0,
                zIndex: 0,
            },
        };
    }

    private get elementClass(): string {
        return `playing-card card-${valueToString(this.props.card.value)}-${suitToString(this.props.card.suit)}`;
    }

    public componentDidMount(): void {
        if (this._ref.current === null) {
            throw new Error('Ref object is null');
        }

        this._$element = $(this._ref.current);

        this._$element.on('dblclick', () => {
            this.props.onDoubleClick(this.props.card.id);
        });

        this._$element.draggable({
            revert: (dropped: boolean): boolean => {
                if (!dropped) {
                    this.restorePosition();
                }

                return !dropped;
            },
            revertDuration: 0,
            disabled: !this.props.card.canBeMoved,
        });
        this._$element.on('dragstart', (): void => {
            this.setState({
                style: {
                    zIndex: 100,
                },
            });
        });

        this._$element.droppable({
            disabled: !this.props.card.canBeMoved,
        });
        this._$element.on('drop', (event: JQuery.Event, ui: JQueryUI.DroppableEventUIParam): void => {
            this.props.onDropped(ui.draggable.data('id'), this.props.card.id);

            event.stopPropagation();
        });
    }

    public componentWillUnmount(): void {
        this._$element.draggable('destroy');
        this._$element.droppable('destroy');
    }

    public render(): React.ReactElement {
        return <div ref={this._ref} className={this.elementClass} data-id={this.props.card.id} style={this.state.style} />;
    }

    public moveToStack(stack: CardStack): void {
        this.move(stack.getCardPosition(this.props.card.id));
    }

    public restorePosition(): void {
        this.move(this._lastPosition);
    }

    public setAvailable(available: boolean): void {
        if (available) {
            this._$element.draggable('enable');
            this._$element.droppable('enable');
        } else {
            this._$element.draggable('disable');
            this._$element.droppable('disable');
        }
    }

    private move(position: Point3D): void {
        this._lastPosition = position;
        this.setState({
            style: {
                left: position.x,
                top: position.y,
                zIndex: position.z,
            },
        });
    }
}