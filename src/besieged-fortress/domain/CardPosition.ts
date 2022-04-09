import CardPositionType from './CardPositionType';

export default class CardPosition {
    public constructor(
        private readonly _position: CardPositionType,
        private readonly _positionIndex: number,
        private readonly _index: number
    ) {
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