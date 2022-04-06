import CardDto from '../dto/CardDto';
import CardPosition from '../CardPosition';

export default class CardMovedEvent {
    constructor(
        private readonly _card: CardDto,
        private readonly _fromPosition: CardPosition,
        private readonly _toPosition: CardPosition
    ) {
    }

    public get card(): CardDto {
        return this._card;
    }

    public get fromPosition(): CardPosition {
        return this._fromPosition;
    }

    public get toPosition(): CardPosition {
        return this._toPosition;
    }
}