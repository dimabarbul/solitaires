import CardDto from './CardDto';

export default class CardStackDto<TCardStackType> {
    public constructor(
        public readonly id: number,
        public readonly type: TCardStackType,
        public readonly cards: readonly CardDto[]
    ) {
    }
}
