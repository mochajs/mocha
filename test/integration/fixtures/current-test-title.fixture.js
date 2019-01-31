'use strict';
var assert = require('assert');

function getTitle(ctx) {
  return ctx.currentTest && ctx.currentTest.title;
};

before(function () {
  assert.equal(getTitle(this), undefined);
});

describe('suite A', () => {

  before(function () {
    assert.equal(getTitle(this), undefined);
  });

  describe('suite B', () => {

    it('test1 B', () => {});

    describe('suite C', function () {
      var lap = 0;

      before(function () {
        assert.equal(getTitle(this), 'test1 C');
      });
      beforeEach(function () {
        assert.equal(getTitle(this), ++lap === 1 ? 'test1 C' : 'test2 C');
      });

      it('test1 C', function () {});
      it('test2 C', function () {});

      afterEach(function () {
        assert.equal(getTitle(this), lap === 1 ? 'test1 C' : 'test2 C');
      });
      after(function () {
        assert.equal(getTitle(this), 'test2 C');
      });
    });
  });
});

after(function () {
  assert.equal(getTitle(this), undefined);
});
