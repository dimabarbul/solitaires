import * as React from 'react';
import { valueToString } from '../../../core/CardValue';
import { suitToString } from '../../../core/CardSuit';
import Point3D from '../../../core/Point3D';
import CardModel from '../models/CardModel';

interface ICardProps {
    card: CardModel
    point: Point3D
    onClick(): void
    onDoubleClick(): void
}

interface ICardState {
}

export default class Card extends React.Component<ICardProps, ICardState> {
    private get elementClass(): string {
        return (this.props.card.isSelected ? 'selected' : '') +
            ' playing-card ' +
            `card-${valueToString(this.props.card.card.value)}-${suitToString(this.props.card.card.suit)}`;
    }

    public render(): React.ReactElement {
        return <div
            className={this.elementClass}
            onClick={this.props.onClick}
            onDoubleClick={this.props.onDoubleClick}
            style={{
                left: this.props.point.x,
                top: this.props.point.y,
                zIndex: this.props.point.z,
            }} />;
    }
}