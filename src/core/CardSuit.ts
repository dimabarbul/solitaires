enum CardSuit {
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3,
}

export default CardSuit;

export function suitToString(suit: CardSuit): string {
    switch (suit) {
        case CardSuit.Clubs:
            return 'c';
        case CardSuit.Diamonds:
            return 'd';
        case CardSuit.Hearts:
            return 'h';
        case CardSuit.Spades:
            return 's';
    }

    throw new Error(`Unexpected card suit ${suit}`);
}

export function suitFromString(suit: string): CardSuit {
    switch (suit) {
        case 'c':
            return CardSuit.Clubs;
        case 'd':
            return CardSuit.Diamonds;
        case 'h':
            return CardSuit.Hearts;
        case 's':
            return CardSuit.Spades;
    }

    throw new Error(`Unexpected card suit string ${suit}`);
}
