import { Assertion, expect } from 'chai';
import CardDto from '../src/bisley/domain/dto/CardDto';
import Card from '../src/core/Card';

/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */

declare global{
    module Chai {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface Assertion {
            cardDto(card: Card): Assertion
        }
    }
}

/* eslint-disable @typescript-eslint/no-invalid-this */
Assertion.addMethod('cardDto', function(card: Card) {
    expect(this._obj).to.be.instanceof(CardDto);
    const cardDto = <CardDto>(this._obj);
    expect(cardDto.suit).to.equal(card.suit);
    expect(cardDto.value).to.equal(card.value);

    return this;
});
/* eslint-enable @typescript-eslint/no-invalid-this */
