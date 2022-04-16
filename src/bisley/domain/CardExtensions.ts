import CardValue from '../../shared-kernel/CardValue';

type CardValueDictionary = {
    [key in CardValue]: number;
};

const cardValueNumber: CardValueDictionary = {
    [CardValue.Ace]: 1,
    [CardValue.Two]: 2,
    [CardValue.Three]: 3,
    [CardValue.Four]: 4,
    [CardValue.Five]: 5,
    [CardValue.Six]: 6,
    [CardValue.Seven]: 7,
    [CardValue.Eight]: 8,
    [CardValue.Nine]: 9,
    [CardValue.Ten]: 10,
    [CardValue.Jack]: 11,
    [CardValue.Queen]: 12,
    [CardValue.King]: 13,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CardExtensions = {
    getCardValueDifference(left: CardValue, right: CardValue): number {
        return cardValueNumber[left] - cardValueNumber[right];
    },
}