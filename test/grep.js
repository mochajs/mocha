
var Mocha = require('../');

describe('Mocha', function(){
  describe('"only-regexp" option', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha({ 'only-regexp': /foo()/ });
      mocha.options.grep.toString().should.equal('/foo()/');
    })

    it('should convert string to a RegExp', function(){
      var mocha = new Mocha({ 'only-regexp': 'foo()' });
      mocha.options.grep.toString().should.equal('/foo()/');
    })
  })

  describe('.only()', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha;
      mocha.only(/foo()/);
      mocha.options.grep.toString().should.equal('/foo()/');
    })

    it('should convert string to an escaped RegExp', function(){
      var mocha = new Mocha;
      mocha.only('foo()');
      mocha.options.grep.toString().should.equal('/foo\\(\\)/');
    })

    it('should return it\'s parent Mocha object for chainability', function(){
      var mocha = new Mocha;
      mocha.only().should.equal(mocha);
    })
  })

  describe('"only" option', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha({ 'only': /foo()/ });
      mocha.options.grep.toString().should.equal('/foo()/');
    })

    it('should convert string to an escaped RegExp', function(){
      var mocha = new Mocha({ 'only': 'foo()' });
      mocha.options.grep.toString().should.equal('/foo\\(\\)/');
    })
  })

  describe('"invert" option', function(){
    it('should add a Boolean to the mocha.options object', function(){
      var mocha = new Mocha({ invert: true });
      mocha.options.invert.should.be.ok;
    })
  })
})
