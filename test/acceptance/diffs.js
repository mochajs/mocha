
var fs = require('fs')
  , cssin = fs.readFileSync('test/acceptance/fixtures/css.in', 'ascii')
  , cssout = fs.readFileSync('test/acceptance/fixtures/css.out', 'ascii');

describe('diffs', function(){
  it('should display a char diff for small strings', function(){
    var a = 'foo bar baz'
      , b = 'foo rar baz';

    // a.should.equal(b);
  })

  it('should display a char diff for medium strings', function(){
    var a = 'foo bar baz\nfoo bar baz\nfoo bar baz'
      , b = 'foo bar baz\nfoo rar baz\nfoo bar raz';

    // a.should.equal(b);
  })

  it('should display a char diff for large strings', function(){
    // cssin.should.equal(cssout);
  })

  it('should display line breaks and white space diffs', function(){
    // special notice to the 4 spaces indent before bar() and the leading line
    // breaks before end of string
    var a = 'function foo(){\n    bar(); }\n// foo\n';
    var b = 'function foo () {\n  bar();\n}\n// foo\n\n\n';
    // a.should.equal(b);
  })

})
