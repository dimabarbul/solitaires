enum CardValue {
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
}

export default CardValue;

function getShortDeckCardValue(value: CardValue): number {
    return value > CardValue.Ace ? value - 4 : value;
}

export function getShortDeckDifference(left: CardValue, right: CardValue): number {
    const shortDeckLeft = getShortDeckCardValue(left);
    const shortDeckRight = getShortDeckCardValue(right);

    return shortDeckLeft - shortDeckRight;
}

export function valueToString(value: CardValue): string {
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

export function valueFromString(value: string): CardValue {
    switch (value) {
        case 'A':
            return CardValue.Ace;
        case '2':
            return CardValue.Two;
        case '3':
            return CardValue.Three;
        case '4':
            return CardValue.Four;
        case '5':
            return CardValue.Five;
        case '6':
            return CardValue.Six;
        case '7':
            return CardValue.Seven;
        case '8':
            return CardValue.Eight;
        case '9':
            return CardValue.Nine;
        case 'T':
            return CardValue.Ten;
        case 'J':
            return CardValue.Jack;
        case 'Q':
            return CardValue.Queen;
        case 'K':
            return CardValue.King;
    }

    throw new Error(`Unexpected card value string ${value}`);
}
