import Card from '../../core/Card';
import CardDto from './dto/CardDto';
import CardPosition from './CardPosition';
import CardPositionType from './CardPositionType';
import ICommand from '../../core/ICommand';
import MoveCardCommand from './commands/MoveCardCommand';
import AceFoundation from './AceFoundation';
import CardSuit from '../../core/CardSuit';
import KingFoundation from './KingFoundation';
import Column from './Column';
import CardValue from '../../core/CardValue';

export default class Game {
    private readonly _aceFoundations: AceFoundation[] = new Array(4);
    private readonly _kingFoundations: KingFoundation[] = new Array(4);
    private readonly _columns: Column[] = new Array(13);

    public start(cards: Card[]): void {
        if (cards.length !== 52) {
            throw new Error(`Invalid number of cards: expected 52, got ${cards.length}`);
        }

        this.initFoundations();
        this.initColumns(cards);
    }

    public canMove(cardDto: CardDto): boolean {
        const card: Card = this.convert(cardDto);
        for (const aceFoundation of this._aceFoundations) {
            if (aceFoundation.isCardAvailable(card)) {
                return true;
            }
        }
        for (const kingFoundation of this._kingFoundations) {
            if (kingFoundation.isCardAvailable(card)) {
                return true;
            }
        }
        for (const column of this._columns) {
            if (column.isCardAvailable(card)) {
                return true;
            }
        }

        return false;
    }

    public canMoveToAnyFoundation(card: CardDto): boolean {
        return this.canMove(card)
            && (this.canMoveToAnyAceFoundation(card) || this.canMoveToAnyKingFoundation(card));
    }

    public moveToAnyFoundation(card: CardDto): ICommand {
        if (!this.canMove(card)) {
            throw new Error(`Cannot move card ${card.toString()}`);
        }

        const foundationNumber: number = this.getFoundationNumber(card);

        if (this.canMoveToAceFoundation(card, foundationNumber)) {
            return this.moveToAceFoundation(card, foundationNumber);
        }

        if (this.canMoveToKingFoundation(card, foundationNumber)) {
            return this.moveToKingFoundation(card, foundationNumber);
        }

        throw new Error(`Cannot move card ${card.toString()} to any foundation`);
    }

    public moveToAceFoundation(card: CardDto, foundationNumber: number): ICommand {
        if (!this.canMoveToAceFoundation(card, foundationNumber)) {
            throw new Error(`Cannot move card ${card.toString()} to ace foundation`);
        }

        const cardPosition: CardPosition = this.getCardPosition(card);
        const command: ICommand = new MoveCardCommand(
            cardPosition.position === CardPositionType.KingFoundation ?
                this.moveFromKingFoundationToAceFoundation.bind(this, cardPosition.positionIndex, foundationNumber) :
                this.moveFromColumnToAceFoundation.bind(this, cardPosition.positionIndex, foundationNumber),
            cardPosition.position === CardPositionType.KingFoundation ?
                this.moveFromAceFoundationToKingFoundation.bind(this, foundationNumber, cardPosition.positionIndex) :
                this.moveFromAceFoundationToColumn.bind(this, foundationNumber, cardPosition.positionIndex),
        );

        command.execute();

        return command;
    }

    public moveToKingFoundation(card: CardDto, foundationNumber: number): ICommand {
        if (!this.canMoveToKingFoundation(card, foundationNumber)) {
            throw new Error(`Cannot move card ${card.toString()} to king foundation`);
        }

        const cardPosition: CardPosition = this.getCardPosition(card);
        const command: ICommand = new MoveCardCommand(
            cardPosition.position === CardPositionType.AceFoundation ?
                this.moveFromAceFoundationToKingFoundation.bind(this, cardPosition.positionIndex, foundationNumber) :
                this.moveFromColumnToKingFoundation.bind(this, cardPosition.positionIndex, foundationNumber),
            cardPosition.position === CardPositionType.AceFoundation ?
                this.moveFromKingFoundationToAceFoundation.bind(this, foundationNumber, cardPosition.positionIndex) :
                this.moveFromKingFoundationToColumn.bind(this, foundationNumber, cardPosition.positionIndex),
        );

        command.execute();

        return command;
    }

    public moveToColumn(cardDto: CardDto, toCard: CardDto): ICommand {
        if (!this.canMove(cardDto)) {
            throw new Error(`Cannot move card ${cardDto}`);
        }

        const cardPosition: CardPosition = this.getCardPosition(cardDto);
        const toCardPosition: CardPosition = this.getCardPosition(toCard);
        const command: ICommand = new MoveCardCommand(
            this.moveFromColumnToColumn.bind(this, cardPosition.positionIndex, toCardPosition.positionIndex),
            this.moveFromColumnToColumn.bind(this, toCardPosition.positionIndex, cardPosition.positionIndex),
        );

        command.execute();

        return command;
    }

    private initFoundations(): void {
        const suits: CardSuit[] = [ CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Hearts, CardSuit.Spades ];
        for (let i = 0; i < suits.length; i++) {
            this._aceFoundations[i] = new AceFoundation(suits[i]);
            this._kingFoundations[i] = new KingFoundation(suits[i]);
        }
    }

    private initColumns(cards: Card[]): void {
        const cardsWithoutAces = cards.filter((card: Card) => card.value !== CardValue.Ace);
        for (let i = 0; i < 4; i++) {
            this._columns[i] = new Column(cardsWithoutAces.slice(i * 3, i * 3 + 3));
        }
        for (let i = 0; i < 9; i++) {
            this._columns[i + 4] = new Column(cardsWithoutAces.slice(12 + i * 4, 12 + i * 4 + 4));
        }
    }

    private canMoveToAnyAceFoundation(cardDto: CardDto): boolean {
        for (let i = 0; i < this._aceFoundations.length; i++) {
            if (this.canMoveToAceFoundation(cardDto, i)) {
                return true;
            }
        }

        return false;
    }

    private canMoveToAnyKingFoundation(cardDto: CardDto): boolean {
        for (let i = 0; i < this._kingFoundations.length; i++) {
            if (this.canMoveToKingFoundation(cardDto, i)) {
                return true;
            }
        }

        return false;
    }

    private canMoveToAceFoundation(cardDto: CardDto, foundationNumber: number): boolean {
        return this._aceFoundations[foundationNumber].canPush(this.convert(cardDto));
    }

    private canMoveToKingFoundation(cardDto: CardDto, foundationNumber: number): boolean {
        return this._kingFoundations[foundationNumber].canPush(this.convert(cardDto));
    }

    private getFoundationNumber(card: CardDto): number {
        for (let i = 0; i < this._aceFoundations.length; i++){
            if (this._aceFoundations[i].suit === card.suit) {
                return i;
            }
        }

        throw new Error(`Cannot find foundation for suit ${card.suit}`);
    }

    private getCardPosition(cardDto: CardDto): CardPosition {
        const card: Card = this.convert(cardDto);
        let position: number | null;

        for (let i = 0; i < this._columns.length; i++){
            position = this._columns[i].findCardIndex(card);
            if (position !== null) {
                return CardPosition.columnPosition(i, position);
            }
        }

        for (let i = 0; i < this._aceFoundations.length; i++){
            position = this._aceFoundations[i].findCardIndex(card);
            if (position !== null) {
                return CardPosition.aceFoundationPosition(i, position);
            }
        }

        for (let i = 0; i < this._kingFoundations.length; i++){
            position = this._kingFoundations[i].findCardIndex(card);
            if (position !== null) {
                return CardPosition.kingFoundationPosition(i, position);
            }
        }

        throw new Error(`Cannot find card ${card.toString()}`);
    }

    private convert(cardDto: CardDto): Card {
        return new Card(cardDto.suit, cardDto.value);
    }

    private moveFromKingFoundationToAceFoundation(kingFoundationNumber: number, aceFoundationNumber: number): void {
        const kingFoundation = this._kingFoundations[kingFoundationNumber];
        const aceFoundation = this._aceFoundations[aceFoundationNumber];

        const card: Card = kingFoundation.pop();
        aceFoundation.push(card);
    }

    private moveFromColumnToAceFoundation(columnNumber: number, aceFoundationNumber: number): void {
        const column = this._columns[columnNumber];
        const aceFoundation = this._aceFoundations[aceFoundationNumber];

        const card: Card = column.pop();
        aceFoundation.push(card);
    }

    private moveFromAceFoundationToKingFoundation(aceFoundationNumber: number, kingFoundationNumber: number): void {
        const aceFoundation = this._aceFoundations[aceFoundationNumber];
        const kingFoundation = this._kingFoundations[kingFoundationNumber];

        const card: Card = aceFoundation.pop();
        kingFoundation.push(card);
    }

    private moveFromAceFoundationToColumn(aceFoundationNumber: number, columnNumber: number): void {
        const aceFoundation = this._aceFoundations[aceFoundationNumber];
        const column = this._columns[columnNumber];

        const card: Card = aceFoundation.pop();
        column.push(card);
    }

    private moveFromColumnToKingFoundation(columnNumber: number, kingFoundationNumber: number): void {
        const column = this._columns[columnNumber];
        const kingFoundation = this._kingFoundations[kingFoundationNumber];

        const card: Card = column.pop();
        kingFoundation.push(card);
    }

    private moveFromKingFoundationToColumn(kingFoundationNumber: number, columnNumber: number): void {
        const kingFoundation = this._kingFoundations[kingFoundationNumber];
        const column = this._columns[columnNumber];

        const card: Card = kingFoundation.pop();
        column.push(card);
    }

    private moveFromColumnToColumn(fromColumnNumber: number, toColumnNumber: number): void {
        const fromColumn = this._columns[fromColumnNumber];
        const toColumn = this._columns[toColumnNumber];

        const card: Card = fromColumn.pop();
        toColumn.push(card);
    }
}