import GameService from '../../application/GameService';
import CardStackWidget, { CardStackDirection } from './CardStackWidget';
import CardWidget from './CardWidget';

export default class BaseWidget extends CardStackWidget {

    constructor(gameService: GameService, element: HTMLDivElement, index: number, cards: CardWidget[]) {
        super(gameService, element, index, CardStackDirection.None, cards);
    }

    protected getElementClassName(): string {
        return `base base-${this._index}`;
    }
}
