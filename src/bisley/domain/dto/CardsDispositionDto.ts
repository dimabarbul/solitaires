import CardStackDto from './CardStackDto';

export default class CardsDispositionDto<TCardStackType> {
    public constructor(
        public readonly stacks: readonly CardStackDto<TCardStackType>[]
    ) {
    }
}