'use strict';

function throwSomething() {
  throw new Error('fixture setup gone wrong');
}

describe('yield fixture exceptions', () => {
  var x = 0;

  before(function*(){
    x++;
    yield;
    x--;
  });
  it('x is 1', () => {
    expect(x, 'to equal', 1);
  });
  describe('describe layer with exception', () => {
    before(function*() {
      x += 3;
      yield;
      x -= 3;
    });
    before(function*() {
      throwSomething();
      yield;
      x -= 30;
    });
    before('should not run at all', () => {
      x += 20;
    });
    it('should not bother running this', () => {
      expect(x, 'to equal', 24);
    });
  });
  describe('describe layer without exception', () => {
    before(function*() {
      x += 3;
      yield;
      x -= 3;
    });
    before('should be fine', () => {
      x += 20;
    });
    it('x is 24', () => {
      expect(x, 'to equal', 24);
    });
  });
});
