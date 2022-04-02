import CardPositionType from './CardPositionType';

export default class CardPosition {
    constructor(
        private readonly _position: CardPositionType,
        private readonly _positionIndex: number,
        private readonly _index: number
    ) {
    }

    get position(): CardPositionType {
        return this._position;
    }

    get positionIndex(): number {
        return this._positionIndex;
    }

    get index(): number {
        return this._index;
    }
}