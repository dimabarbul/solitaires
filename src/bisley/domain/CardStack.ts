import Card, { areCardsEqual } from '../../core/Card';

export default abstract class CardStack {
    protected constructor(
        private readonly _cards: Card[]
    ) {
    }

    public isCardAvailable(card: Card): boolean {
        return this._cards.length > 0 && areCardsEqual(this._cards[this._cards.length - 1], card);
    }

    public pop(): Card {
        if (this._cards.length === 0) {
            throw new Error('CardStack is empty');
        }

        return this._cards.pop();
    }

    public push(card: Card): void {
        if (!this.canPush(card)) {
            throw new Error(`Cannot push card ${card.toString()} to ${this.toString()}`);
        }

        this._cards.push(card);
    }

    public findCardIndex(card: Card): number | null {
        for (let i = 0; i < this._cards.length; i++) {
            if (areCardsEqual(this._cards[i], card)) {
                return i;
            }
        }

        return null;
    }

    protected isEmpty(): boolean {
        return this._cards.length === 0;
    }

    protected get topCard(): Card {
        if (this._cards.length === 0) {
            throw new Error('CardStack is empty');
        }

        return this._cards[this._cards.length - 1];
    }

    public get length(): number {
        return this._cards.length;
    }

    abstract canPush(card: Card): boolean;
}