'use strict';

var helpers = require('../integration/helpers');
var run = helpers.runMochaJSON;
var args = [];

describe('yield fixtures', () => {
  var x;

  before('first before', function*() {
    x = 0;
    yield;
    x = undefined;
  });

  before('second before', function*() {
    x++;
    yield;
    x--;
  });

  beforeEach('before each', function*() {
    x += 2;
    yield;
    x -= 2;
  });

  it('x is 3', () => {
    expect(x, 'to equal', 3);
  });

  describe('inner describe', () => {
    before('inner before', function*() {
      x += 6;
      yield;
      x -= 6;
    });

    it('x is 9', () => {
      expect(x, 'to equal', 9);
    });
  });

  describe('another inner describe', () => {
    before('inner before', function*() {
      x += 10;
      yield;
      x -= 10;
    });

    it('x is 13', () => {
      expect(x, 'to equal', 13);
    });
  });
});

describe('uncaught errors', function() {
  it('only successful fixtures are torn down', function(done) {
    run('uncaught/yield.fixture.js', args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed with error', 'fixture setup gone wrong')
        .and('to have passed test count', 2)
        .and('to have pending test count', 0)
        .and('to have failed test count', 1)
        .and(
          'to have failed test',
          '"before all" hook for "should not bother running this"'
        );

      done();
    });
  });
});

describe('yield beforeEach', () => {
  var x = 0;

  beforeEach(function*() {
    x++;
    yield;
    x--;
  });

  it('x is 1', () => {
    expect(x, 'to equal', 1);
  });

  it('x is still 1', () => {
    expect(x, 'to equal', 1);
  });

  describe('yield beforeEach nested', () => {
    // var x = 0;

    beforeEach(function*() {
      x += 2;
      yield;
      x -= 2;
    });

    it('x is 3', () => {
      expect(x, 'to equal', 3);
    });

    it('x is still 3', () => {
      expect(x, 'to equal', 3);
    });
  });
});
