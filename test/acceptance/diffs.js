
var fs = require('fs')
  , cssin = fs.readFileSync('test/acceptance/fixtures/css.in', 'ascii')
  , cssout = fs.readFileSync('test/acceptance/fixtures/css.out', 'ascii');

describe('diffs', function(){
  
  // uncomment the assertions, and run with different params to check the output
  // ex: --color, --no-color, --unified-diff
  
  it('should display a diff for small strings', function(){
    var expected = 'one two three';
    var actual   = 'one zzz three';
    //actual.should.eql(expected);
  });

  it('should display a diff for multi-line strings', function(){
    var expected = 'one two three\nfour five six\nseven eight nine';
    var actual   = 'one two three\nfour zzzz six\nseven eight nine';
    //actual.should.eql(expected);
  });

  it('should display a diff for entire object dumps', function(){
    var expected = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'  }}
    var actual   = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa' }};
    //actual.should.eql(expected);
  });

  it('should display a word diff for large strings', function(){
    // cssin.should.equal(cssout);
  });
  
});
