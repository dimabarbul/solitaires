import Card from '../../shared/domain/Card';
import { ICommand } from '../../shared/libs/Commands';
import AceFoundation from './AceFoundation';
import CardSuit from '../../shared/domain/CardSuit';
import KingFoundation from './KingFoundation';
import Column from './Column';
import CardValue from '../../shared/domain/CardValue';
import CardStackType from './CardStackType';
import AbstractGame from '../../shared/domain/AbstractGame';

export default class Game extends AbstractGame<CardStackType> {
    private readonly aceFoundations: AceFoundation[] = new Array(4);
    private readonly kingFoundations: KingFoundation[] = new Array(4);
    private readonly columns: Column[] = new Array(13);

    public constructor(cards: readonly Card[]) {
        super();

        if (cards.length !== 52) {
            throw new Error(`Invalid number of cards: expected 52, got ${cards.length}`);
        }

        this.createFoundations(cards);
        this.createColumns(cards);
        this.fillStacks([this.aceFoundations, this.kingFoundations, this.columns]);
    }

    public canMoveCardToAnyFoundation(cardId: number): boolean {
        return this.canMoveCardToStackOfType(cardId, [CardStackType.AceFoundation, CardStackType.KingFoundation]);
    }

    public moveCardToAnyFoundation(cardId: number): ICommand {
        return this.moveCardToStackOfType(cardId, [CardStackType.AceFoundation, CardStackType.KingFoundation]);
    }

    public isGameFinished(): boolean {
        return this.columns.every(c => c.isEmpty);
    }

    private createFoundations(cards: readonly Card[]): void {
        const suits: CardSuit[] = [ CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades ];

        for (let i = 0; i < suits.length; i++) {
            this.aceFoundations[i] = new AceFoundation(
                i,
                suits[i],
                cards.find(c => c.suit === suits[i] && c.value === CardValue.Ace)
                    ?? ((): never => {
                        throw new Error(`Cannot find ace card for suit ${suits[i]}`);
                    })()
            );
            this.kingFoundations[i] = new KingFoundation(i + 4, suits[i]);
        }
    }

    private createColumns(cards: readonly Card[]): void {
        const cardsWithoutAces = cards.filter((card: Card) => card.value !== CardValue.Ace);

        for (let i = 0; i < 4; i++) {
            this.columns[i] = new Column(i + 8, cardsWithoutAces.slice(i * 3, i * 3 + 3));
        }

        for (let i = 0; i < 9; i++) {
            this.columns[i + 4] = new Column(i + 12, cardsWithoutAces.slice(12 + i * 4, 12 + i * 4 + 4));
        }
    }
}