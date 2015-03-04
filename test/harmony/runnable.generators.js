var mocha = require('../../')
  , utils = mocha.utils
  , Runnable = mocha.Runnable
  , EventEmitter = require('events').EventEmitter
  , should = require('should');

module.exports = function() {
  describe('when fn is a GeneratorFunction', function() {
    it('should invoke the callback', function(done) {
      var invoked = false;
      var test = new Runnable('foo', function* () {
        yield new Promise(function(resolve, reject) {
          var cb = function() {
            invoked = true;
            resolve();
          };
          process.nextTick(cb);
        });
      });

      test.run(function(err) {
        should(!err).ok;
        invoked.should.equal(true);
        done();
      });
    });

    it('should invoke the callback with an error if thrown', function(done) {
      var expectedErr = new Error('GeneratorFunction test');
      var test = new Runnable('foo', function* () {
        throw expectedErr;
      });

      test.run(function(err) {
        err.should.equal(expectedErr);
        done();
      });
    });

    it('does not require the callback', function(done) {
      var invoked = false;
      var test = new Runnable('foo', function* () {
        invoked = true;
      });

      test.run(function(err) {
        should(!err).ok;
        invoked.should.equal(true);
        done();
      });
    });
  });
};
