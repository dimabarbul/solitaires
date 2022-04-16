import CardSuit from '../shared-kernel/CardSuit';
import CardValue from '../shared-kernel/CardValue';
import CardDto from '../shared-kernel/dto/CardDto';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ClassHelper = {
    get undo(): string {
        return 'undo';
    },
    get redo(): string {
        return 'redo';
    },
    card(card: CardDto): string {
        return 'playing-card ' +
            `playing-card-${valueToString(card.value)}-${suitToString(card.suit)}`
    },
}

function suitToString(suit: CardSuit): string {
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

function valueToString(value: CardValue): string {
    switch (value) {
        case CardValue.Ace:
            return 'A';
        case CardValue.Two:
            return '2';
        case CardValue.Three:
            return '3';
        case CardValue.Four:
            return '4';
        case CardValue.Five:
            return '5';
        case CardValue.Six:
            return '6';
        case CardValue.Seven:
            return '7';
        case CardValue.Eight:
            return '8';
        case CardValue.Nine:
            return '9';
        case CardValue.Ten:
            return 'T';
        case CardValue.Jack:
            return 'J';
        case CardValue.Queen:
            return 'Q';
        case CardValue.King:
            return 'K';
    }

    throw new Error(`Unexpected card value ${value}`);
}
