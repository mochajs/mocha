
var fs = require('fs')
  , cssin = fs.readFileSync('test/acceptance/fixtures/css.in', 'ascii')
  , cssout = fs.readFileSync('test/acceptance/fixtures/css.out', 'ascii');

describe('diffs', function(){
  
  // uncomment the assertions, and run with different params to check the output
  // ex: --color, --no-color, --unified-diff
  
  it('should display a diff for small strings', function(){
    var a = 'foo bar baz'
      , b = 'foo rar baz';
    //a.should.eql(b);
  });

  it('should display a diff for medium strings', function(){
    var a = 'foo bar baz\nfoo bar baz\nfoo bar baz'
      , b = 'foo bar baz\nfoo rar baz\nfoo bar raz';
    //a.should.eql(b);
  });

  it('should display a diff for entire object dumps', function(){
    var a = { name: 'joe',  age: 30, address: {city: 'new york', country: 'us'}}
      , b = { name: 'joel', age: 30, address: {city: 'new york', country: 'usa'}};
    //a.should.eql(b);
  });

  it('should display a word diff for large strings', function(){
    // cssin.should.equal(cssout);
  });
  
});
