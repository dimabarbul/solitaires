import { Assertion, expect } from 'chai';

/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */

declare global{
    module Chai {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface Assertion {
            in(numbers: number[]): Assertion
            number: Assertion
        }
    }
}

/* eslint-disable @typescript-eslint/no-invalid-this */
Assertion.addMethod('in', function(numbers: number[]) {
    expect(numbers).contain(this._obj);

    return this;
});
Assertion.addProperty('number', function() {
    expect(this._obj).to.be.instanceof(Number);
});
/* eslint-enable @typescript-eslint/no-invalid-this */
