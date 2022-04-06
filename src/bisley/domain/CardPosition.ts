import CardPositionType from './CardPositionType';

export default class CardPosition {
    constructor(
        private readonly _position: CardPositionType,
        private readonly _positionIndex: number,
        private readonly _index: number
    ) {
    }

    public static columnPosition(positionIndex: number, index: number): CardPosition {
        return new CardPosition(CardPositionType.Column, positionIndex, index);
    }

    public static aceFoundationPosition(positionIndex: number, index: number): CardPosition {
        return new CardPosition(CardPositionType.AceFoundation, positionIndex, index);
    }

    public static kingFoundationPosition(positionIndex: number, index: number): CardPosition {
        return new CardPosition(CardPositionType.KingFoundation, positionIndex, index);
    }

    public get position(): CardPositionType {
        return this._position;
    }

    public get positionIndex(): number {
        return this._positionIndex;
    }

    public get index(): number {
        return this._index;
    }
}