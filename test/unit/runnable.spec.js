'use strict';

var mocha = require('../../lib/mocha');
var utils = mocha.utils;
var Runnable = mocha.Runnable;
var Suite = mocha.Suite;

describe('Runnable(title, fn)', function () {
  // For every test we poison the global time-related methods.
  // runnable.js etc. should keep its own local copy, in order to fix GH-237.
  // NB: we can't poison global.Date because the normal implementation of
  // global.setTimeout uses it [1] so if the runnable.js keeps a copy of
  // global.setTimeout (like it's supposed to), that will blow up.
  // [1]: https://github.com/joyent/node/blob/7fc835afe362ebd30a0dbec81d3360bd24525222/lib/timers.js#L74
  var setTimeout = global.setTimeout;
  var setInterval = global.setInterval;
  var clearTimeout = global.clearTimeout;
  var clearInterval = global.clearInterval;

  function poisonPill () {
    throw new Error("Don't use global time-related stuff.");
  }

  beforeEach(function () {
    global.setTimeout =
    global.setInterval =
    global.clearTimeout =
    global.clearInterval = poisonPill;
  });

  afterEach(function () {
    global.setTimeout = setTimeout;
    global.setInterval = setInterval;
    global.clearTimeout = clearTimeout;
    global.clearInterval = clearInterval;
  });

  describe('#timeout(ms)', function () {
    it('should set the timeout', function () {
      var run = new Runnable();
      run.timeout(1000);
      expect(run.timeout()).to.equal(1000);
    });
  });

  describe('#timeout(ms) when ms>2^31', function () {
    it('should set disabled', function () {
      var run = new Runnable();
      run.timeout(1e10);
      expect(run.enableTimeouts()).to.equal(false);
    });
  });

  describe('#enableTimeouts(enabled)', function () {
    it('should set enabled', function () {
      var run = new Runnable();
      run.enableTimeouts(false);
      expect(run.enableTimeouts()).to.equal(false);
    });
  });

  describe('#slow(ms)', function () {
    var run;

    beforeEach(function () {
      run = new Runnable();
    });

    it('should set the slow threshold', function () {
      run.slow(100);
      expect(run.slow()).to.equal(100);
    });

    it('should not set the slow threshold if the parameter is not passed', function () {
      run.slow();
      expect(run.slow()).to.equal(75);
    });

    it('should not set the slow threshold if the parameter is undefined', function () {
      run.slow(undefined);
      expect(run.slow()).to.equal(75);
    });
  });

  describe('.title', function () {
    it('should be present', function () {
      expect(new Runnable('foo').title).to.equal('foo');
    });
  });

  describe('.titlePath()', function () {
    it('returns the concatenation of the parent\'s title path and runnable\'s title', function () {
      var runnable = new Runnable('bar');
      runnable.parent = new Suite('foo');
      expect(runnable.titlePath()).to.eql(['foo', 'bar']);
    });
  });

  describe('when arity >= 1', function () {
    it('should be .async', function () {
      var run = new Runnable('foo', function (done) {});
      expect(run.async).to.equal(1);
      expect(run.sync).to.be(false);
    });
  });

  describe('when arity == 0', function () {
    it('should be .sync', function () {
      var run = new Runnable('foo', function () {});
      expect(run.async).to.be.equal(0);
      expect(run.sync).to.be(true);
    });
  });

  describe('#globals', function () {
    it('should allow for whitelisting globals', function (done) {
      var test = new Runnable('foo', function () {});
      expect(test.async).to.be.equal(0);
      expect(test.sync).to.be(true);
      test.globals(['foobar']);
      test.run(done);
    });
  });

  describe('#retries(n)', function () {
    it('should set the number of retries', function () {
      var run = new Runnable();
      run.retries(1);
      expect(run.retries()).to.equal(1);
    });
  });

  describe('.run(fn)', function () {
    describe('when .pending', function () {
      it('should not invoke the callback', function (done) {
        var test = new Runnable('foo', function () {
          throw new Error('should not be called');
        });

        test.pending = true;
        test.run(done);
      });
    });

    describe('when sync', function () {
      describe('without error', function () {
        it('should invoke the callback', function (done) {
          var calls = 0;
          var test = new Runnable('foo', function () {
            ++calls;
          });

          test.run(function (err) {
            if (err) {
              done(err);
              return;
            }

            try {
              expect(calls)
                .to
                .equal(1);
              expect(test.duration)
                .to
                .be
                .a('number');
            } catch (err) {
              done(err);
              return;
            }
            done();
          });
        });
      });

      describe('when an exception is thrown', function () {
        it('should invoke the callback', function (done) {
          var calls = 0;
          var test = new Runnable('foo', function () {
            ++calls;
            throw new Error('fail');
          });

          test.run(function (err) {
            expect(calls).to.equal(1);
            expect(err.message).to.equal('fail');
            done();
          });
        });
      });

      describe('when an exception is thrown and is allowed to remain uncaught', function () {
        it('throws an error when it is allowed', function (done) {
          var test = new Runnable('foo', function () {
            throw new Error('fail');
          });
          test.allowUncaught = true;
          function fail () {
            test.run(function () {});
          }
          expect(fail).to.throwError('fail');
          done();
        });
      });
    });

    describe('when timeouts are disabled', function () {
      it('should not error with timeout', function (done) {
        var test = new Runnable('foo', function (done) {
          setTimeout(function () {
            setTimeout(done);
          }, 2);
        });
        test.timeout(1);
        test.enableTimeouts(false);
        test.run(done);
      });
    });

    describe('when async', function () {
      describe('without error', function () {
        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function (done) {
            setTimeout(done);
          });

          test.run(done);
        });
      });

      describe('when the callback is invoked several times', function () {
        describe('without an error', function () {
          it('should emit a single "error" event', function (done) {
            var calls = 0;
            var errCalls = 0;

            var test = new Runnable('foo', function (done) {
              process.nextTick(done);
              setTimeout(done);
              setTimeout(done);
              setTimeout(done);
            });

            test.on('error', function (err) {
              ++errCalls;
              expect(err.message).to.equal('done() called multiple times');
              expect(calls).to.equal(1);
              expect(errCalls).to.equal(1);
              done();
            });

            test.run(function () {
              ++calls;
            });
          });
        });

        describe('with an error', function () {
          it('should emit a single "error" event', function (done) {
            var calls = 0;
            var errCalls = 0;

            var test = new Runnable('foo', function (done) {
              done(new Error('fail'));
              setTimeout(done);
              done(new Error('fail'));
              setTimeout(done);
              setTimeout(done);
            });

            test.on('error', function (err) {
              ++errCalls;
              expect(err.message).to.equal('fail');
              expect(calls).to.equal(1);
              expect(errCalls).to.equal(1);
              done();
            });

            test.run(function () {
              ++calls;
            });
          });
        });
      });

      describe('when an exception is thrown', function () {
        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function (done) {
            throw new Error('fail');
          });

          test.run(function (err) {
            expect(err.message).to.equal('fail');
            done();
          });
        });

        it('should not throw its own exception if passed a non-object', function (done) {
          var test = new Runnable('foo', function (done) {
            /* eslint no-throw-literal: off */
            throw null;
          });

          test.run(function (err) {
            expect(err.message).to.equal(utils.undefinedError().message);
            done();
          });
        });
      });

      describe('when an exception is thrown and is allowed to remain uncaught', function () {
        it('throws an error when it is allowed', function (done) {
          var test = new Runnable('foo', function (done) {
            throw new Error('fail');
          });
          test.allowUncaught = true;
          function fail () {
            test.run(function () {});
          }
          expect(fail).to.throwError('fail');
          done();
        });
      });

      describe('when an error is passed', function () {
        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function (done) {
            done(new Error('fail'));
          });

          test.run(function (err) {
            expect(err.message).to.equal('fail');
            done();
          });
        });
      });

      describe('when done() is invoked with a non-Error object', function () {
        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function (done) {
            done({ error: 'Test error' });
          });

          test.run(function (err) {
            expect(err.message).to.equal('done() invoked with non-Error: {"error":"Test error"}');
            done();
          });
        });
      });

      describe('when done() is invoked with a string', function () {
        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function (done) {
            done('Test error');
          });

          test.run(function (err) {
            expect(err.message).to.equal('done() invoked with non-Error: Test error');
            done();
          });
        });
      });

      it('should allow updating the timeout', function (done) {
        var callCount = 0;
        var increment = function () {
          callCount++;
        };
        var test = new Runnable('foo', function (done) {
          setTimeout(increment, 1);
          setTimeout(increment, 100);
        });
        test.timeout(50);
        test.run(function (err) {
          expect(err).to.be.ok();
          expect(callCount).to.equal(1);
          done();
        });
      });

      it('should allow a timeout of 0');
    });

    describe('when fn returns a promise', function () {
      describe('when the promise is fulfilled with no value', function () {
        var fulfilledPromise = {
          then: function (fulfilled, rejected) {
            setTimeout(fulfilled);
          }
        };

        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function () {
            return fulfilledPromise;
          });

          test.run(done);
        });
      });

      describe('when the promise is fulfilled with a value', function () {
        var fulfilledPromise = {
          then: function (fulfilled, rejected) {
            setTimeout(function () {
              fulfilled({});
            });
          }
        };

        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function () {
            return fulfilledPromise;
          });

          test.run(done);
        });
      });

      describe('when the promise is rejected', function () {
        var expectedErr = new Error('fail');
        var rejectedPromise = {
          then: function (fulfilled, rejected) {
            setTimeout(function () {
              rejected(expectedErr);
            });
          }
        };

        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function () {
            return rejectedPromise;
          });

          test.run(function (err) {
            expect(err).to.equal(expectedErr);
            done();
          });
        });
      });

      describe('when the promise is rejected without a reason', function () {
        var expectedErr = new Error('Promise rejected with no or falsy reason');
        var rejectedPromise = {
          then: function (fulfilled, rejected) {
            setTimeout(function () {
              rejected();
            });
          }
        };

        it('should invoke the callback', function (done) {
          var test = new Runnable('foo', function () {
            return rejectedPromise;
          });

          test.run(function (err) {
            expect(err.message).to.equal(expectedErr.message);
            done();
          });
        });
      });

      describe('when the promise takes too long to settle', function () {
        var foreverPendingPromise = {
          then: function () { }
        };

        it('should give the timeout error', function (done) {
          var test = new Runnable('foo', function () {
            return foreverPendingPromise;
          });

          test.timeout(10);
          test.run(function (err) {
            expect(err).to.be.ok();
            done();
          });
        });
      });
    });

    describe('when fn returns a non-promise', function () {
      it('should invoke the callback', function (done) {
        var test = new Runnable('foo', function () {
          return { then: 'i ran my tests' };
        });

        test.run(done);
      });
    });
  });
});
