
var Mocha = require('../');

describe('Mocha', function(){
  describe('"grep" option', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha({ grep: /foo/ });
      mocha.options.grep.toString().should.equal('/foo/');
    })

    it('should convert grep string to a RegExp', function(){
      var mocha = new Mocha({ grep: 'foo' });
      mocha.options.grep.toString().should.equal('/foo/');
    })
  })

  describe('.grep()', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha;
      mocha.grep(/foo/);
      mocha.options.grep.toString().should.equal('/foo/');
    })

    it('should convert grep string to a RegExp', function(){
      var mocha = new Mocha;
      mocha.grep('foo');
      mocha.options.grep.toString().should.equal('/foo/');
    })

    it('should return it\'s parent Mocha object for chainability', function(){
      var mocha = new Mocha;
      mocha.grep().should.equal(mocha);
    })
  })

  describe('"invert" option', function(){
    it('should add a Boolean to the mocha.options object', function(){
      var mocha = new Mocha({ invert: true });
      mocha.options.invert.should.be.ok;
    })
  })
})
