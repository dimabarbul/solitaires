import GameService from '../application/GameService';
import CardsDispositionDto from '../domain/dto/CardsDispositionDto';
import AppWidget from './widgets/AppWidget';

window.onload = function () {
    const gameService: GameService = new GameService();
    gameService.start();
    const cardsDisposition: CardsDispositionDto = gameService.getCardsDisposition();

    const app: AppWidget = new AppWidget(gameService, 'app');
    app.createLayout(cardsDisposition);
}
