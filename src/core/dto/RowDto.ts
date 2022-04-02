import CardDto from './CardDto';

export default class RowDto {
    constructor(private readonly _cards: CardDto[]) {
    }

    get cards(): CardDto[] {
        return this._cards;
    }
}