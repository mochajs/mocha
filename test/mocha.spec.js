var Mocha = require('../');
var Test = Mocha.Test;

describe('Mocha', function(){
  var blankOpts = { reporter: function(){} }; // no output

  describe('.run(fn)', function(){
    it('should not raise errors if callback was not provided', function(){
      var mocha = new Mocha(blankOpts);
      mocha.run();
    })

    it('should execute the callback when complete', function(done) {
      var mocha = new Mocha(blankOpts);
      mocha.run(function(){
        done();
      })
    })

    it('should execute the callback with the number of failures '+
      'as parameter', function(done) {
      var mocha = new Mocha(blankOpts);
      var failingTest = new Test('failing test', function(){
        throw new Error('such fail');
      });
      mocha.suite.addTest(failingTest);
      mocha.run(function(failures) {
        failures.should.equal(1);
        done();
      });
    })
  })
})
