
var fs = require('fs')
  , cssin = fs.readFileSync('test/acceptance/fixtures/css.in', 'ascii')
  , cssout = fs.readFileSync('test/acceptance/fixtures/css.out', 'ascii');

describe('diffs', function(){
  it('should display a char diff for small strings', function(){
    var a = 'foo bar baz'
      , b = 'foo rar baz';

    // a.should.equal(b);
  })

  it('should display a word diff for medium strings', function(){
    var a = 'foo bar baz\nfoo bar baz\nfoo bar baz'
      , b = 'foo bar baz\nfoo rar baz\nfoo bar raz';

    // a.should.equal(b);
  })

  it('should display a word diff for large strings', function(){
    var err = new Error();
    err.message = 'strings are not the same';
    err.expected = cssout;
    err.actual = cssin;
    // showDiff = true to check conflicts with multi-line string diffs
    err.showDiff = true;
    // throw err;
  })
})
