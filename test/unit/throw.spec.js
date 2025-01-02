'use strict';

/* eslint no-throw-literal: off */

var sinon = require('sinon');
var Mocha = require('../../lib/mocha');
var Suite = Mocha.Suite;
var Test = Mocha.Test;
var Runnable = Mocha.Runnable;
var Runner = Mocha.Runner;
var EVENT_RUN_END = Runner.constants.EVENT_RUN_END;
var STATE_FAILED = Runnable.constants.STATE_FAILED;

describe('a test that throws', function () {
  var suite;
  var runner;
  var uncaughtHandlers;

  beforeEach(function () {
    suite = new Suite('Suite', 'root');
    runner = new Runner(suite);

    // see https://github.com/mochajs/mocha/pull/2983#issuecomment-350428522
    uncaughtHandlers = process.listeners('uncaughtException') || [];
    process.removeAllListeners('uncaughtException');
  });

  afterEach(function () {
    process.removeAllListeners('uncaughtException');
    uncaughtHandlers.forEach(function (listener) {
      process.on('uncaughtException', listener);
    });
    sinon.restore();
  });

  describe('non-extensible', function () {
    it('should not pass if throwing sync and test is sync', function (done) {
      var test = new Test('im sync and throw string sync', function () {
        throw 'non-extensible';
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function (done) {
      var test = new Test('im async and throw string sync', function () {
        throw 'non-extensible';
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function (done) {
      var test = new Test('im async and throw string async', function () {
        process.nextTick(function () {
          throw 'non-extensible';
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });
  });

  describe('undefined', function () {
    it('should not pass if throwing sync and test is sync', function (done) {
      var test = new Test('im sync and throw undefined sync', function () {
        throw undefined;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function (done) {
      var test = new Test('im async and throw undefined sync', function () {
        throw undefined;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function (done) {
      var test = new Test('im async and throw undefined async', function () {
        process.nextTick(function () {
          throw undefined;
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });
  });

  describe('null', function () {
    it('should not pass if throwing sync and test is sync', function (done) {
      var test = new Test('im sync and throw null sync', function () {
        throw null;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function (done) {
      var test = new Test('im async and throw null sync', function () {
        throw null;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function (done) {
      var test = new Test('im async and throw null async', function () {
        process.nextTick(function () {
          throw null;
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on(EVENT_RUN_END, function () {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', STATE_FAILED);
        done();
      });
      runner.run();
    });
  });

  describe('stack', function () {
    it('should include the stack when throwing async', function(done) {
      var test = new Test('im async and throw null async', function() {
        process.nextTick(function throwError() {
          throw new Error('test error');
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      sinon.stub(runner, 'fail');

      runner.on(EVENT_RUN_END, function() {
        try {
          expect(runner.fail, 'to have all calls satisfying', [
            expect.it('to be a', Runnable),
            expect.it('to be an', Error).and('to satisfy', {
              message: /test error/i,
              stack: /throwError/i,
              uncaught: true
            })
          ]).and('was called once');
        } catch (err) {
          return done(err);
        }

        done();
      });
      runner.run();
    });
  });
});
