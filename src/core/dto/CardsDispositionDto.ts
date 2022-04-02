import BaseDto from './BaseDto';
import RowDto from './RowDto';

export default class CardsDispositionDto {
    constructor(
        private readonly _bases: BaseDto[],
        private readonly _rows: RowDto[]
    ) {
    }

    get bases(): BaseDto[] {
        return this._bases;
    }

    get rows(): RowDto[] {
        return this._rows;
    }
}