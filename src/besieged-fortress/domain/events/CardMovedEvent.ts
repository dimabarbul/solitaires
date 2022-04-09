import CardPosition from '../CardPosition';
import CardDto from '../dto/CardDto';

export default class CardMovedEvent {
    public constructor(
        private readonly _card: CardDto,
        private readonly _from: CardPosition,
        private readonly _to: CardPosition
    ) {
    }

    public get card(): CardDto {
        return this._card;
    }

    public get from(): CardPosition {
        return this._from;
    }

    public get to(): CardPosition {
        return this._to;
    }
}