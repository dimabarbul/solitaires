import CardStackDto from '../../../shared/domain/dto/CardStackDto';

export default class CardsDispositionDto<TCardStackType> {
    public constructor(
        public readonly stacks: CardStackDto<TCardStackType>[]
    ) {
    }
}
