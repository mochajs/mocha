var fs = require('fs')
  , cssin = fs.readFileSync('test/acceptance/fixtures/css.in', 'ascii')
  , cssout = fs.readFileSync('test/acceptance/fixtures/css.out', 'ascii');

describe('diffs', function(){
  // uncomment the assertions, and run with different params to check the output
  // ex: --color, --no-color, --unified-diff

  it('should display a diff for small strings', function(){
    var expected = 'foo bar baz'
      , actual = 'foo rar baz';

    // expected.should.eql(actual);
  });

  it('should display a diff of canonicalized objects', function(){
    var actual = { name: 'travis j', age: 23 }
      , expected = { age: 23, name: 'travis' };

      // actual.should.eql(expected);
  });

  it('should display a diff for medium strings', function(){
    var expected = 'foo bar baz\nfoo bar baz\nfoo bar baz'
      , actual = 'foo bar baz\nfoo rar baz\nfoo bar raz';

    // expected.should.eql(actual);
  });

  it('should display a diff for entire object dumps', function(){
     var expected = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'  }}
      , actual   = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa' }};

      // actual.should.eql(expected);
  });

  it('should display a diff for multi-line strings', function(){
    var expected = 'one two three\nfour five six\nseven eight nine';
    var actual   = 'one two three\nfour zzzz six\nseven eight nine';

    // actual.should.eql(expected);
  });

  it('should display a diff for entire object dumps', function(){
    var expected = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'  }}
    var actual   = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa' }};

    // actual.should.eql(expected);
  });

  it('should display a full-comparison with escaped special characters', function(){
    var expected = 'one\ttab\ntwo\t\ttabs';
    var actual   = 'one\ttab\ntwo\t\t\ttabs';

    //actual.should.equal(expected);
  });

  it('should display a word diff for large strings', function(){
    // cssin.should.equal(cssout);
  });

  it('should work with objects', function(){
    var tobi = {
      name: 'tobi',
      species: 'ferret',
      color: 'white',
      age: 2
    };

    var loki = {
      name: 'loki',
      species: 'ferret',
      color: 'brown',
      age: 2
    };

    // tobi.should.eql(loki);
  });

  it('should show value diffs and not be affected by commas', function(){
    var obj1 = { a: 123 };
    var obj2 = { a: 123, b: 456 };

    // obj1.should.equal(obj2);
  });
});
