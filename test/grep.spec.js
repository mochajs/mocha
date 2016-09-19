var Mocha = require('../');

describe('Mocha', function(){
  describe('"grep" option', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha({ grep: /foo.*/ });
      mocha.options.grep.toString().should.equal('/foo.*/');
    });

    it('should convert string to a RegExp', function(){
      var mocha = new Mocha({ grep: 'foo.*' });
      mocha.options.grep.toString().should.equal('/foo.*/');
    });
  });

  describe('"fgrep" option', function(){
    it('should escape and convert string to a RegExp', function(){
      var mocha = new Mocha({ fgrep: 'foo.*' });
      mocha.options.grep.toString().should.equal('/foo\\.\\*/');
    });
  });

  describe('.grep()', function() {
    // Test helper
    function testGrep(mocha) {
      return function testGrep(grep, expected) {
        mocha.grep(grep);
        mocha.options.grep.toString().should.equal(expected);
      }
    }

    it('should add a RegExp to the mocha.options object', function() {
      var test = testGrep(new Mocha);
      test(/foo/, '/foo/');
    });

    it('should convert grep string to a RegExp', function() {
      var test = testGrep(new Mocha);
      test('foo', '/foo/');
      test('^foo.*bar$', '/^foo.*bar$/');
      test('^@.*(?=\\(\\)$)', '/^@.*(?=\\(\\)$)/');
    });

    it('should covert grep regex-like string to a RegExp', function() {
      var test = testGrep(new Mocha);
      test('/foo/', '/foo/');
      // Keep the flags
      test('/baz/i', '/baz/i');
      test('/bar/g', '/bar/g');
      test('/^foo(.*)bar/g', '/^foo(.*)bar/g');
    });

    it('should return it\'s parent Mocha object for chainability', function(){
      var mocha = new Mocha;
      mocha.grep().should.equal(mocha);
    });
  });

  describe('"invert" option', function(){
    it('should add a Boolean to the mocha.options object', function(){
      var mocha = new Mocha({ invert: true });
      mocha.options.invert.should.be.ok;
    });
  });
});
