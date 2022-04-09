import BaseDto from './BaseDto';
import RowDto from './RowDto';

export default class CardsDispositionDto {
    public constructor(
        private readonly _bases: BaseDto[],
        private readonly _rows: RowDto[]
    ) {
    }

    public get bases(): BaseDto[] {
        return this._bases;
    }

    public get rows(): RowDto[] {
        return this._rows;
    }
}