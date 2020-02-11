'use strict';

describe('Uncaught exception within pending test', () => {
  it('test1', function () { });

  it('test2', function () {
    process.nextTick(function () {
      throw new Error('I am uncaught!');
    });
    this.skip();
  });

  it('test3 - should run', function () { });
  it('test4 - should run', function () { });
});
