var fs     = require('fs');
var assert = require('assert');
var cssin  = fs.readFileSync('test/integration/fixtures/diffs/diffs.css.in', 'ascii');
var cssout = fs.readFileSync('test/integration/fixtures/diffs/diffs.css.out', 'ascii');

describe('diffs', function() {
  var actual, expected;

  it('should display a diff for small strings', function() {
    actual = 'foo rar baz';
    expected = 'foo bar baz';
    actual.should.equal(expected);
  });

  it('should display a diff of canonicalized objects', function() {
    actual = { name: 'travis j', age: 23 };
    expected = { age: 23, name: 'travis' };
    actual.should.equal(expected);
  });

  it('should display a diff for medium strings', function() {
    actual = 'foo bar baz\nfoo rar baz\nfoo bar raz';
    expected = 'foo bar baz\nfoo bar baz\nfoo bar baz';
    actual.should.equal(expected);
  });

  it('should display a diff for entire object dumps', function() {
    actual   = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa' }};
    expected = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'  }};
    actual.should.equal(expected);
  });

  it('should display a diff for multi-line strings', function() {
    actual   = 'one two three\nfour zzzz six\nseven eight nine';
    expected = 'one two three\nfour five six\nseven eight nine';
    actual.should.equal(expected);
  });

  it('should display a diff for entire object dumps', function() {
    actual   = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa' }};
    expected = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'  }}
    actual.should.equal(expected);
  });

  it('should display a full-comparison with escaped special characters', function() {
    actual   = 'one\ttab\ntwo\t\t\ttabs';
    expected = 'one\ttab\ntwo\t\ttabs';
    actual.should.equal(expected);
  });

  it('should display a word diff for large strings', function() {
    cssin.should.equal(cssout);
  });

  it('should work with objects', function() {
    actual = {
      name: 'tobi',
      species: 'ferret',
      color: 'white',
      age: 2
    };

    expected = {
      name: 'loki',
      species: 'ferret',
      color: 'brown',
      age: 2
    };

    actual.should.eql(expected);
  });

  it('should show value diffs and not be affected by commas', function() {
    actual = { a: 123 };
    expected = { a: 123, b: 456 };
    actual.should.equal(expected);
  });

  it('should display diff by data and not like an objects', function() {
    actual = new Buffer([0x01]);
    expected = new Buffer([0x02]);
    actual.should.equal(expected);
  });
});
