'use strict';

module.exports = class {
  before () {
    this.number1 = 1;
  }

  beforeEach () {
    this.number2 = 2;
  }

  itShouldNotRun () {
    expect(1).to.equal(2);
  }

  itOnlyShouldAdd () {
    expect(this.number1 + this.number2).to.equal(3);
  }

  after () {
    this.number1 = 0;
  }

  afterEach () {
    this.number2 = 200;
  }
};
