import CardStackDto from '../../../shared-kernel/dto/CardStackDto';

export default class CardsDispositionDto<TCardStackType> {
    public constructor(
        public readonly stacks: readonly CardStackDto<TCardStackType>[]
    ) {
    }
}