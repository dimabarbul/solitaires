import CardDto from './CardDto';

export default class BaseDto {
    constructor(private readonly _cards: CardDto[]) {
    }

    get cards(): CardDto[] {
        return this._cards;
    }
}