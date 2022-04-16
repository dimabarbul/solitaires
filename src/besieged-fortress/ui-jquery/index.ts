import GameService from '../application/GameService';
import Deck from '../../shared/domain/Deck';
import AppWidget from './widgets/AppWidget';

const deck: Deck = Deck.getShortDeck();
const gameService: GameService = new GameService();
gameService.start(deck.cards);

gameService.onGameFinished.subscribe(() => {
    window.alert('You won!');
});

const app: AppWidget = new AppWidget(gameService, 'app');
app.createLayout();
