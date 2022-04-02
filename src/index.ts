import GameService from './application/GameService';
import CardsDispositionDto from './core/dto/CardsDispositionDto';
import App from './application/widgets/App';

window.onload = function () {
    const gameService: GameService = new GameService();
    gameService.start();
    const cardsDisposition: CardsDispositionDto = gameService.getCardsDisposition();

    const app: App = new App(gameService, 'app'/*, gameService.cardsCount*/);
    app.createLayout(cardsDisposition);
}