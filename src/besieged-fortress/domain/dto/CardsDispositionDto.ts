import CardStackDto from '../../../shared/domain/dto/CardStackDto';
import CardStackType from '../CardStackType';

export default class CardsDispositionDto {
    public constructor(
        public readonly stacks: CardStackDto<CardStackType>[]
    ) {
    }
}
