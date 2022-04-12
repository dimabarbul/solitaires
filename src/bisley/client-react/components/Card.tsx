import * as React from 'react';
import CardDto from '../../domain/dto/CardDto';
import { valueToString } from '../../../core/CardValue';
import { suitToString } from '../../../core/CardSuit';
import Point3D from '../../../core/Point3D';

interface ICardProps {
    card: CardDto
    point: Point3D
    onDoubleClick(cardId: number): void
}

interface ICardState {
}

export default class Card extends React.Component<ICardProps, ICardState> {
    private get elementClass(): string {
        return `playing-card card-${valueToString(this.props.card.value)}-${suitToString(this.props.card.suit)}`;
    }

    public render(): React.ReactElement {
        return <div
            className={this.elementClass}
            onDoubleClick={this.props.onDoubleClick.bind(this, this.props.card.id)}
            style={{
                left: this.props.point.x,
                top: this.props.point.y,
                zIndex: this.props.point.z,
            }} />;
    }
}