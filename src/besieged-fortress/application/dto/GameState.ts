import CardsDispositionDto from '../../../shared/domain/dto/CardsDispositionDto';
import CardStackType from '../../domain/CardStackType';

export default class GameState {
    public constructor(
        public readonly orderViolations: number,
        public readonly cardsDisposition: CardsDispositionDto<CardStackType>
    ) {
    }
}