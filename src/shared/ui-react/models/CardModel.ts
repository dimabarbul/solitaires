import CardDto from '../../domain/dto/CardDto';

export default class CardModel {
    public constructor (
        public readonly card: CardDto,
        public readonly isSelected: boolean
    ) {
    }
}