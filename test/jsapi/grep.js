var Mocha = require('../../');

describe('Mocha', function(){

  beforeEach(function(){
    this.reEqual = function(r1, r2){
      return r1.source === r2.source
          && r1.global === r2.global
          && r1.ignoreCase === r2.ignoreCase
          && r1.multiline === r2.multiline;
    }
  })

  describe('constructor options.grep', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha({grep:/foo/});
      this.reEqual(/foo/, mocha.options.grep).should.be.ok;
    })

    it('should convert grep string to a RegExp', function(){
      var mocha = new Mocha({grep:'foo'});
      this.reEqual(/foo/, mocha.options.grep).should.be.ok;
    })
  })

  describe('.grep()', function(){
    it('should add a RegExp to the mocha.options object', function(){
      var mocha = new Mocha();
      mocha.grep(/foo/);
      this.reEqual(/foo/, mocha.options.grep).should.be.ok;
    })

    it('should convert grep string to a RegExp', function(){
      var mocha = new Mocha();
      mocha.grep('foo');
      this.reEqual(/foo/, mocha.options.grep).should.be.ok;
    })

    it('should return it\'s parent Mocha object for chainability', function(){
      var mocha = new Mocha();
      mocha.grep().should.equal(mocha);
    })
  })
})
