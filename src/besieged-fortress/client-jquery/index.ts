import GameService from '../application/GameService';
import Deck from '../../core/Deck';
import AppWidget from '../../base-jquery/widgets/AppWidget';

const deck: Deck = Deck.getShortDeck();
const gameService: GameService = new GameService();
gameService.start(deck.cards);

gameService.onGameFinished.subscribe(() => {
    window.alert('You won!');
});

const app: AppWidget = new AppWidget(gameService, 'app');
app.createLayout();
