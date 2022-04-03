import CardPosition from '../CardPosition';
import CardDto from '../dto/CardDto';

export default class CardMovedEvent {
    constructor(
        private readonly _card: CardDto,
        private readonly _from: CardPosition,
        private readonly _to: CardPosition
    ) {
    }

    get card(): CardDto {
        return this._card;
    }

    get from(): CardPosition {
        return this._from;
    }

    get to(): CardPosition {
        return this._to;
    }
}