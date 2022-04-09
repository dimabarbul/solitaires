import CardDto from './CardDto';

export default class RowDto {
    public constructor(private readonly _cards: CardDto[]) {
    }

    public get cards(): CardDto[] {
        return this._cards;
    }
}