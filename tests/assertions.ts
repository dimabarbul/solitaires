import { Assertion, expect } from 'chai';
import CardDto from '../src/bisley/domain/dto/CardDto';
import Card from '../src/core/Card';

declare global{
    module Chai {
        interface Assertion {
            cardDto(card: Card): Assertion;
        }
    }
}

Assertion.addMethod('cardDto', function(card: Card) {
    expect(this._obj).to.be.instanceof(CardDto);
    const cardDto = this._obj as CardDto;
    expect(cardDto.suit).to.equal(card.suit);
    expect(cardDto.value).to.equal(card.value);

    return this;
});
