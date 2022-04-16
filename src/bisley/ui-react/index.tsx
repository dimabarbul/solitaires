import { createRoot, Root } from 'react-dom/client';
import * as React from 'react';
import App from './components/App';
import Deck from '../../shared/domain/Deck';
import GameService from '../application/GameService';

const deck: Deck = Deck.getFullDeck();
const gameService: GameService = new GameService();
gameService.start(deck.cards);

const rootElement: HTMLElement = document.getElementById('app')
    ?? ((): never => {
        throw new Error('No root element found');
    })();
const root: Root = createRoot(rootElement);
root.render(<App gameService={gameService} />);
