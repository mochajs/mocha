'use strict';

module.exports = class IntegerPrimitivesArithmetic {
  before () {
    this.number1 = 1;
  }

  beforeEach () {
    this.number2 = 2;
  }

  itSkipShouldNotRun () {
    expect(1).to.equal(2);
  }

  itShouldAdd () {
    expect(this.number1 + this.number2).to.equal(3);
  }

  itShouldSubstract (done) {
    setTimeout(function () {
      expect(this.number1 - this.number2).to.equal(-1);
      done();
    }.bind(this), 10);
  }

  after () {
    this.number1 = 0;
  }

  afterEach () {
    this.number2 = 200;
  }
};
