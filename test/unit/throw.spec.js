'use strict';

/* eslint no-throw-literal: off */

var Suite = require('../../lib/suite');
var Test = require('../../lib/test');
var Runner = require('../../lib/runner');

describe('a test that throws', function() {
  var suite;
  var runner;
  var uncaughtHandlers;

  beforeEach(function() {
    suite = new Suite('Suite', 'root');
    runner = new Runner(suite);

    // see https://github.com/mochajs/mocha/pull/2983#issuecomment-350428522
    uncaughtHandlers = process.listeners('uncaughtException') || [];
    process.removeAllListeners('uncaughtException');
  });

  afterEach(function() {
    uncaughtHandlers.forEach(function(listener) {
      process.on('uncaughtException', listener);
    });
  });

  describe('non-extensible', function() {
    it('should not pass if throwing sync and test is sync', function(done) {
      var test = new Test('im sync and throw string sync', function() {
        throw 'non-extensible';
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function(done) {
      var test = new Test('im async and throw string sync', function(done2) {
        throw 'non-extensible';
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function(done) {
      var test = new Test('im async and throw string async', function(done2) {
        process.nextTick(function() {
          throw 'non-extensible';
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });
  });

  describe('undefined', function() {
    it('should not pass if throwing sync and test is sync', function(done) {
      var test = new Test('im sync and throw undefined sync', function() {
        throw undefined;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function(done) {
      var test = new Test('im async and throw undefined sync', function(done2) {
        throw undefined;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function(done) {
      var test = new Test('im async and throw undefined async', function(
        done2
      ) {
        process.nextTick(function() {
          throw undefined;
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });
  });

  describe('null', function() {
    it('should not pass if throwing sync and test is sync', function(done) {
      var test = new Test('im sync and throw null sync', function() {
        throw null;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing sync and test is async', function(done) {
      var test = new Test('im async and throw null sync', function(done2) {
        throw null;
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });

    it('should not pass if throwing async and test is async', function(done) {
      var test = new Test('im async and throw null async', function(done2) {
        process.nextTick(function() {
          throw null;
        });
      });
      suite.addTest(test);
      runner = new Runner(suite);
      runner.on('end', function() {
        expect(runner.failures, 'to be', 1);
        expect(test.state, 'to be', 'failed');
        done();
      });
      runner.run();
    });
  });
});
