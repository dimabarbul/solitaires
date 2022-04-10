import { createRoot, Root } from 'react-dom/client';
import * as React from 'react';
import App from './components/App';
import Deck from '../../core/Deck';
import GameService from '../application/GameService';

const deck: Deck = Deck.getFullDeck();
const gameService: GameService = new GameService();
gameService.start(deck.cards);

// gameService.onGameFinished.subscribe(() => {
//     window.alert('You won!');
// });

// const app: AppWidget = new AppWidget(gameService, 'app');
// app.createLayout();

const rootElement: HTMLElement = document.getElementById('app')
    ?? ((): never => {
        throw new Error('No root element found');
    })();
const root: Root = createRoot(rootElement);
root.render(<App gameService={gameService} />);

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        gameService: GameService
    }
}

window.gameService = gameService;