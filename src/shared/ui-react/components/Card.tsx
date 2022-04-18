import * as React from 'react';
import { Point3D } from '../../libs/Points';
import CardModel from '../models/CardModel';
import { ClassHelper } from '../../ui/ClassHelper';

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
        return (this.props.card.isSelected ? 'selected ' : '')
            + ClassHelper.card(this.props.card.card);
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