import GameService from '../application/GameService';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import AppWidget from './widgets/AppWidget';
import Deck from '../domain/Deck';

window.onload = function () {
    const deck: Deck = Deck.getShortDeckInReverseOrder();
    const gameService: GameService = new GameService();
    gameService.start(deck);
    const cardsDisposition: CardsDispositionDto = gameService.getCardsDisposition();

    const app: AppWidget = new AppWidget(gameService, 'app');
    app.createLayout(cardsDisposition);
}
