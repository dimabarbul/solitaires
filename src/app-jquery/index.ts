import GameService from '../application/GameService';
import AppWidget from './widgets/AppWidget';
import Deck from '../domain/Deck';

const deck: Deck = Deck.getShortDeck();
const gameService: GameService = new GameService();
gameService.start(deck.cards);

const app: AppWidget = new AppWidget(gameService, 'app');
app.createLayout();
