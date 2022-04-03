# Besieged Fortress Solitaire

## Description

The program is an implementation of Besieged Fortress solitaire.

## Rules

**Deck**: 36 cards.  
**Goal**: place all cards on bases from 6 to king of the same suit.  
**Initial position**: aces are dealt in column - bases. Other cards are dealt in 8 rows: 4 on the left side of the bases, 4 - on the right side.  
**How to play**: only one card can be moved in one turn. Only last cards of each of the 8 rows are available for moves. Card can be moved to: 1) base if it will form correct sequence, 2) on other available card if it's value is one less than value of the card is moved to, 3) on empty space left after all cards from some row are moved.

## Controls

You can use drag-and-drop to move cards around. Double-click on a card will try to move it to base.

## Building

To install application dependencies (required to build the application and to run tests):

```bash
npm install
```

To build application:
```bash
npm run build
```

To run tests:
```bash
npm test
```

To run application open `wwwroot/index.html` in browser.
