import Card from './Card';
import CardStackDto from './dto/CardStackDto';
import CardDto from './dto/CardDto';

export default abstract class CardStack<TCardStackType> {
    private readonly cards: Card[];

    protected constructor(
        public readonly id: number,
        public readonly type: TCardStackType,
        cards: readonly Card[]
    ) {
        this.cards = cards.slice(0, cards.length);
    }

    public get isEmpty(): boolean {
        return this.cards.length === 0;
    }

    protected get topCard(): Card {
        if (this.cards.length === 0) {
            throw new Error('Card stack is empty');
        }

        return this.cards[this.cards.length - 1];
    }

    public isCardAvailable(cardId: number): boolean {
        return this.cards.length > 0 && this.cards[this.cards.length - 1].id === cardId;
    }

    public pop(): Card {
        return this.cards.pop()
            ?? ((): never => {
                throw new Error('Card stack is empty');
            })();
    }

    public push(card: Card, validateCard: boolean = true): void {
        if (validateCard && !this.canPush(card)) {
            throw new Error(`Cannot push card ${card.toString()} to stack ${this.id}`);
        }

        this.cards.push(card);
    }

    public mapToDto(): CardStackDto<TCardStackType> {
        return new CardStackDto<TCardStackType>(
            this.id,
            this.type,
            this.cards.map(c => new CardDto(c.id, c.suit, c.value, this.isCardAvailable(c.id)))
        );
    }

    public findCard(cardId: number): Card | null {
        for (const card of this.cards) {
            if (card.id === cardId) {
                return card;
            }
        }

        return null;
    }

    public contains(cardId: number): boolean {
        return this.cards.some(c => c.id === cardId);
    }

    public abstract canPush(card: Card): boolean;
}