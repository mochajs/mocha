'use strict';

var Mocha = require('../../lib/mocha');
var Runnable = Mocha.Runnable;
var Suite = Mocha.Suite;
var sinon = require('sinon');
const {TIMEOUT} = require('../../lib/errors').constants;
var STATE_FAILED = Runnable.constants.STATE_FAILED;

describe('Runnable(title, fn)', function () {
  describe('#timeout(ms)', function () {
    var DISABLED_TIMEOUTS = 0;
    var MAX_TIMEOUT = 2147483647; // INT_MAX (32-bit signed integer)

    describe('when value is less than lower bound', function () {
      it('should clamp to lower bound given numeric', function () {
        var run = new Runnable();
        run.timeout(-1);
        expect(run.timeout(), 'to be', DISABLED_TIMEOUTS);
      });
      it('should clamp to lower bound given timestamp', function () {
        var run = new Runnable();
        run.timeout('-1 ms');
        expect(run.timeout(), 'to be', DISABLED_TIMEOUTS);
      });
    });

    describe('when value is equal to lower bound', function () {
      var run;

      beforeEach(function () {
        run = new Runnable();
        run.timeout(DISABLED_TIMEOUTS);
      });
      describe('given numeric value', function () {
        it('should set the timeout value to disabled', function () {
          expect(run.timeout(), 'to be', DISABLED_TIMEOUTS);
        });
      });

      describe('given string timestamp', function () {
        it('should set the timeout value to disabled', function () {
          expect(run.timeout(), 'to be', DISABLED_TIMEOUTS);
        });
      });
    });

    describe('when value is within `setTimeout` bounds', function () {
      var run;
      var timeout = 1000;

      beforeEach(function () {
        run = new Runnable();
        run.timeout(timeout);
      });

      describe('given numeric value', function () {
        it('should set the timeout value', function () {
          expect(run.timeout(), 'to be', timeout);
        });
      });

      describe('given string timestamp', function () {
        it('should set the timeout value', function () {
          expect(run.timeout(), 'to be', timeout);
        });
      });
    });

    describe('when value is equal to upper bound', function () {
      var run;

      beforeEach(function () {
        run = new Runnable();
        run.timeout(MAX_TIMEOUT);
      });
      describe('given numeric value', function () {
        it('should set the disabled timeout value', function () {
          expect(run.timeout(), 'to be', 0);
        });
      });
    });

    describe('when value is out-of-bounds', function () {
      var run;
      var timeout = MAX_TIMEOUT + 1;

      beforeEach(function () {
        run = new Runnable();
        run.timeout(timeout);
      });

      describe('given numeric value', function () {
        it('should set the disabled timeout value', function () {
          expect(run.timeout(), 'to be', 0);
        });
      });
    });
  });

  describe('#slow(ms)', function () {
    var run;

    beforeEach(function () {
      run = new Runnable();
    });

    it('should set the slow threshold', function () {
      run.slow(100);
      expect(run.slow(), 'to be', 100);
    });

    it('should not set the slow threshold if the parameter is not passed', function () {
      run.slow();
      expect(run.slow(), 'to be', 75);
    });

    it('should not set the slow threshold if the parameter is undefined', function () {
      run.slow(undefined);
      expect(run.slow(), 'to be', 75);
    });

    describe('when passed a time-formatted string', function () {
      it('should convert to ms', function () {
        run.slow('1s');
        expect(run.slow(), 'to be', 1000);
      });
    });
  });

  describe('#reset', function () {
    var run;

    beforeEach(function () {
      run = new Runnable();
    });

    it('should reset current run state', function () {
      run.timedOut = true;
      run._currentRetry = 5;
      run.pending = true;
      run.err = new Error();
      run.state = 'error';

      run.reset();
      expect(run.timedOut, 'to be false');
      expect(run._currentRetry, 'to be', 0);
      expect(run.pending, 'to be false');
      expect(run.err, 'to be undefined');
      expect(run.state, 'to be undefined');
    });
  });

  describe('.title', function () {
    it('should be present', function () {
      expect(new Runnable('foo').title, 'to be', 'foo');
    });
  });

  describe('.titlePath()', function () {
    it("returns the concatenation of the parent's title path and runnable's title", function () {
      var runnable = new Runnable('bar');
      runnable.parent = new Suite('foo');
      expect(
        JSON.stringify(runnable.titlePath()),
        'to be',
        JSON.stringify(['foo', 'bar'])
      );
    });
  });

  describe('when arity >= 1', function () {
    var run;

    beforeEach(function () {
      run = new Runnable('foo', function () {});
    });

    it('should be .async', function () {
      expect(run.async, 'to be', 1);
    });

    it('should not be .sync', function () {
      expect(run.sync, 'to be false');
    });
  });

  describe('when arity == 0', function () {
    var run;

    beforeEach(function () {
      run = new Runnable('foo', function () {});
    });

    it('should not be .async', function () {
      expect(run.async, 'to be', 0);
    });

    it('should be .sync', function () {
      expect(run.sync, 'to be true');
    });
  });

  describe('#globals', function () {
    it('should allow for whitelisting globals', function () {
      var runnable = new Runnable('foo', function () {});
      runnable.globals(['foobar']);
      expect(runnable._allowedGlobals, 'to equal', ['foobar']);
    });
  });

  describe('#retries(n)', function () {
    it('should set the number of retries', function () {
      var run = new Runnable();
      run.retries(1);
      expect(run.retries(), 'to be', 1);
    });
  });

  describe('.run(fn)', function () {
    describe('when .pending', function () {
      it('should not invoke the callback', function (done) {
        var spy = sinon.spy();
        var runnable = new Runnable('foo', spy);

        runnable.pending = true;
        runnable.run(function (err) {
          if (err) {
            return done(err);
          }
          expect(spy, 'was not called');
          done();
        });
      });
    });

    describe('when sync', function () {
      describe('without error', function () {
        it('should invoke the callback', function (done) {
          var spy = sinon.spy();
          var runnable = new Runnable('foo', spy);

          runnable.run(function (err) {
            if (err) {
              return done(err);
            }

            expect(spy, 'was called times', 1);
            done();
          });
        });
      });

      describe('when an exception is thrown', function () {
        it('should invoke the callback with error', function (done) {
          var stub = sinon.stub().throws('Error', 'fail');
          var runnable = new Runnable('foo', stub);

          runnable.run(function (err) {
            expect(err.message, 'to be', 'fail');
            expect(stub, 'was called');
            done();
          });
        });
      });

      describe('when an exception is thrown and is allowed to remain uncaught', function () {
        it('throws an error when it is allowed', function () {
          var stub = sinon.stub().throws('Error', 'fail');
          var runnable = new Runnable('foo', stub);
          runnable.allowUncaught = true;

          function fail() {
            runnable.run(function () {});
          }
          expect(fail, 'to throw', 'fail');
        });
      });
    });

    describe('when timeouts are disabled', function () {
      it('should not error with timeout', function (done) {
        var runnable = new Runnable('foo', function (done) {
          setTimeout(function () {
            setTimeout(done);
          }, 2);
        });
        runnable.timeout(1);
        runnable.timeout(0);
        runnable.run(function (err) {
          expect(err, 'to be falsy');
          done();
        });
      });
    });

    describe('when async', function () {
      describe('without error', function () {
        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function (done) {
            setTimeout(done);
          });

          runnable.run(function (err) {
            expect(err, 'to be falsy');
            done();
          });
        });
      });

      describe('when the callback is invoked several times', function () {
        describe('without an error', function () {
          it('should emit a single "error" event', function (done) {
            var callbackSpy = sinon.spy();
            var errorSpy = sinon.spy();

            var runnable = new Runnable('foo', function (done) {
              process.nextTick(done);
              setTimeout(done);
              setTimeout(done);
              setTimeout(done);
            });

            // XXX too many diff assertions and very flimsy assertion that this
            // event was only emitted once.  think of a better way.
            runnable.on('error', errorSpy).on('error', function (err) {
              process.nextTick(function () {
                expect(errorSpy, 'was called times', 1);
                expect(
                  err.message,
                  'to match',
                  /done\(\) called multiple times/
                );
                expect(callbackSpy, 'was called times', 1);
                done();
              });
            });

            runnable.run(callbackSpy);
          });
        });

        describe('with an error', function () {
          it('should emit a single "error" event', function (done) {
            var callbackSpy = sinon.spy();
            var errorSpy = sinon.spy();

            var runnable = new Runnable('foo', function (done) {
              done(new Error('fail'));
              setTimeout(done);
              done(new Error('fail'));
              setTimeout(done);
              setTimeout(done);
            });

            // XXX too many diff assertions and very flimsy assertion that this
            // event was only emitted once.  think of a better way.
            runnable.on('error', errorSpy).on('error', function (err) {
              process.nextTick(function () {
                expect(errorSpy, 'was called times', 1);
                expect(
                  err.message,
                  'to match',
                  /done\(\) called multiple times.+received error: Error: fail/
                );
                expect(callbackSpy, 'was called times', 1);
                done();
              });
            });

            runnable.run(callbackSpy);
          });
        });
      });

      describe('when an exception is thrown', function () {
        it('should invoke the callback', function (done) {
          var runnable = new Runnable(
            'foo',
            sinon.stub().throws('Error', 'fail')
          );

          runnable.run(function (err) {
            expect(err.message, 'to be', 'fail');
            done();
          });
        });

        it('should not throw its own exception if passed a non-object', function (done) {
          var runnable = new Runnable('foo', function () {
            /* eslint no-throw-literal: off */
            throw null;
          });

          runnable.run(function (err) {
            expect(err.message, 'to be', Runnable.toValueOrError().message);
            done();
          });
        });
      });

      describe('when an exception is thrown and is allowed to remain uncaught', function () {
        it('throws an error when it is allowed', function (done) {
          var runnable = new Runnable('foo', function () {
            throw new Error('fail');
          });
          runnable.allowUncaught = true;

          function fail() {
            runnable.run(function () {});
          }
          expect(fail, 'to throw', 'fail');
          done();
        });
      });

      describe('when an error is passed', function () {
        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function (done) {
            done(new Error('fail'));
          });

          runnable.run(function (err) {
            expect(err.message, 'to be', 'fail');
            done();
          });
        });
      });

      describe('when done() is invoked with a non-Error object', function () {
        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function (done) {
            done({
              error: 'Test error'
            });
          });

          runnable.run(function (err) {
            expect(
              err.message,
              'to be',
              'done() invoked with non-Error: {"error":"Test error"}'
            );
            done();
          });
        });
      });

      describe('when done() is invoked with a string', function () {
        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function (done) {
            done('Test error');
          });

          runnable.run(function (err) {
            expect(
              err.message,
              'to be',
              'done() invoked with non-Error: Test error'
            );
            done();
          });
        });
      });

      it('should allow updating the timeout', function (done) {
        var spy = sinon.spy();
        var runnable = new Runnable('foo', function () {
          setTimeout(spy, 1);
          setTimeout(spy, 100);
        });
        runnable.timeout(50);
        runnable.run(function (err) {
          expect(err, 'to be truthy');
          expect(spy, 'was called times', 1);
          done();
        });
      });

      it('should allow a timeout of 0', function (done) {
        const runnable = new Runnable('foo', () => {});
        runnable.timeout(0);
        runnable.run(err => {
          expect(err, 'to be falsy');
          done();
        });
      });
    });

    describe('when fn returns a promise', function () {
      describe('when the promise is fulfilled with no value', function () {
        var fulfilledPromise = {
          then: function (fulfilled) {
            setTimeout(fulfilled);
          }
        };

        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function () {
            return fulfilledPromise;
          });

          runnable.run(function (err) {
            expect(err, 'to be falsy');
            done();
          });
        });
      });

      describe('when the promise is fulfilled with a value', function () {
        var fulfilledPromise = {
          then: function (fulfilled) {
            setTimeout(function () {
              fulfilled({});
            });
          }
        };

        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function () {
            return fulfilledPromise;
          });

          runnable.run(function (err) {
            expect(err, 'to be falsy');
            done();
          });
        });
      });

      describe('when the promise is rejected', function () {
        var expectedErr = new Error('fail');
        var rejectedPromise = {
          then: function (_fulfilled, rejected) {
            setTimeout(function () {
              rejected(expectedErr);
            });
          }
        };

        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function () {
            return rejectedPromise;
          });

          runnable.run(function (err) {
            expect(err, 'to be', expectedErr);
            done();
          });
        });
      });

      describe('when the promise is rejected without a reason', function () {
        var expectedErr = new Error('Promise rejected with no or falsy reason');
        var rejectedPromise = {
          then: function (_fulfilled, rejected) {
            setTimeout(function () {
              rejected();
            });
          }
        };

        it('should invoke the callback', function (done) {
          var runnable = new Runnable('foo', function () {
            return rejectedPromise;
          });

          runnable.run(function (err) {
            expect(err.message, 'to be', expectedErr.message);
            done();
          });
        });
      });

      describe('when the promise takes too long to settle', function () {
        var foreverPendingPromise = {
          then: function () {}
        };

        it('should throw the timeout error', function (done) {
          var runnable = new Runnable('foo', function () {
            return foreverPendingPromise;
          });
          runnable.file = '/some/path';

          runnable.timeout(10);
          runnable.run(function (err) {
            expect(err, 'to satisfy', {code: TIMEOUT, timeout: 10});
            done();
          });
        });
      });
    });

    describe('when fn returns a non-promise', function () {
      it('should invoke the callback', function (done) {
        var runnable = new Runnable('foo', function () {
          return {
            then: 'i ran my tests'
          };
        });

        runnable.run(done);
      });
    });

    describe('if timed-out', function () {
      it('should ignore call to `done` and not execute callback again', function (done) {
        var runnable = new Runnable('foo', function (done) {
          setTimeout(done, 20);
        });
        runnable.timeout(10);
        runnable.run(function (err) {
          expect(err, 'to satisfy', {code: TIMEOUT, timeout: 10});
          // timedOut is set *after* this callback is executed
          process.nextTick(function () {
            expect(runnable.timedOut, 'to be truthy');
            done();
          });
        });
      });
    });

    describe('if async', function () {
      it('this.skip() should set runnable to pending', function (done) {
        var runnable = new Runnable('foo', function () {
          // normally "this" but it gets around having to muck with a context
          runnable.skip();
        });
        runnable.run(function (err) {
          expect(err, 'to be undefined');
          expect(runnable.pending, 'to be true');
          done();
        });
      });

      it('this.skip() should halt synchronous execution', function (done) {
        var aborted = true;
        var runnable = new Runnable('foo', function () {
          // normally "this" but it gets around having to muck with a context
          runnable.skip();
          /* istanbul ignore next */
          aborted = false;
        });
        runnable.run(function () {
          process.nextTick(function () {
            expect(aborted, 'to be true');
            done();
          });
        });
      });
    });

    describe('when fn is not a function', function () {
      it('should throw an error', function () {
        var runnable = new Runnable('foo', 4);

        runnable.run(function (err) {
          expect(
            err.message,
            'to be',
            'A runnable must be passed a function as its second argument.'
          );
        });
      });
    });
  });

  describe('#isFailed()', function () {
    it('should return `true` if test has not failed', function () {
      var runnable = new Runnable('foo', function () {});
      // runner sets the state
      runnable.run(function () {
        expect(runnable.isFailed(), 'to be false');
      });
    });

    it('should return `true` if test has failed', function () {
      var runnable = new Runnable('foo', function () {});
      // runner sets the state
      runnable.state = STATE_FAILED;
      runnable.run(function () {
        expect(runnable.isFailed(), 'to be false');
      });
    });

    it('should return `false` if test is pending', function () {
      var runnable = new Runnable('foo', function () {});
      // runner sets the state
      runnable.isPending = function () {
        return true;
      };
      runnable.run(function () {
        expect(runnable.isFailed(), 'to be false');
      });
    });
  });

  describe('#resetTimeout()', function () {
    it('should not time out if timeouts disabled after reset', function (done) {
      var runnable = new Runnable('foo', function () {});
      runnable.timeout(10);
      runnable.resetTimeout();
      runnable.timeout(0);
      runnable.run();
      setTimeout(function () {
        expect(runnable.timedOut, 'to be', false);
        done();
      }, 20);
    });
  });

  describe('static method', function () {
    describe('toValueOrError', function () {
      it('should return identity if parameter is truthy', function () {
        expect(Runnable.toValueOrError('foo'), 'to be', 'foo');
      });

      it('should return an Error if parameter is falsy', function () {
        expect(Runnable.toValueOrError(null), 'to be an', Error);
      });
    });
  });

  describe('interesting property', function () {
    describe('id', function () {
      it('should have a unique identifier', function () {
        expect(new Runnable('foo', () => {}), 'to have property', 'id');
      });

      it('should have a permanent identifier', function () {
        const runnable = new Runnable('foo', () => {});
        expect(runnable.id, 'to be', runnable.id);
      });
    });
  });
});
