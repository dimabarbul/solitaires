import CardValue from '../../shared/domain/CardValue';

type ShortDeckValues = CardValue.Ace | CardValue.Six | CardValue.Seven | CardValue.Eight | CardValue.Nine | CardValue.Ten | CardValue.Jack | CardValue.Queen | CardValue.King;

type CardValueDictionary = {
    [key in ShortDeckValues]: number;
};

const cardValueNumber: CardValueDictionary = {
    [CardValue.Ace]: 1,
    [CardValue.Six]: 2,
    [CardValue.Seven]: 3,
    [CardValue.Eight]: 4,
    [CardValue.Nine]: 5,
    [CardValue.Ten]: 6,
    [CardValue.Jack]: 7,
    [CardValue.Queen]: 8,
    [CardValue.King]: 9,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CardExtensions = {
    getCardValueDifference(left: CardValue, right: CardValue): number {
        return cardValueNumber[left] - cardValueNumber[right];
    },
}