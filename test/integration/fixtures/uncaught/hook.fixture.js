'use strict';

describe('uncaught', function () {
  beforeEach(function (done) {
    process.nextTick(function () {
      throw new Error('oh noes');
    });
  });

  it('test', function (done) {
    process.nextTick(function () {
      throw new Error("I'm uncaught!");
    });
  });
});
