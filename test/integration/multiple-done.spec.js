'use strict';

var runMochaJSON = require('./helpers').runMochaJSON;
var invokeMocha = require('./helpers').invokeMocha;
var MULTIPLE_DONE = require('../../lib/errors').constants.MULTIPLE_DONE;

describe('multiple calls to done()', function() {
  var res;
  describe('from a spec', function() {
    before(function(done) {
      runMochaJSON('multiple-done', function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in failure', function() {
      expect(res, 'to have failed test count', 1)
        .and('to have passed test count', 1)
        .and('to have pending test count', 0)
        .and('to have failed');
    });

    it('throws a descriptive error', function() {
      expect(res, 'to have failed with error', {
        message: /done\(\) called multiple times in test <should fail in a test-case> \(of root suite\) of file.+multiple-done\.fixture\.js/,
        code: MULTIPLE_DONE
      });
    });
  });

  describe('with error passed on second call', function() {
    before(function(done) {
      runMochaJSON('multiple-done-with-error', function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in failure', function() {
      expect(res, 'to have failed test count', 1)
        .and('to have passed test count', 1)
        .and('to have pending test count', 0)
        .and('to have failed');
    });

    it('should throw a descriptive error', function() {
      expect(res, 'to have failed with error', {
        message: /done\(\) called multiple times in test <should fail in a test-case> \(of root suite\) of file.+multiple-done-with-error\.fixture\.js; in addition, done\(\) received error: Error: second error/,
        code: MULTIPLE_DONE
      });
    });
  });

  describe('with multiple specs', function() {
    before(function(done) {
      runMochaJSON('multiple-done-specs', function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in failure', function() {
      expect(res, 'to have failed test count', 1)
        .and('to have passed test count', 2)
        .and('to have pending test count', 0)
        .and('to have failed');
    });

    it('correctly attributes the error', function() {
      expect(res.failures[0], 'to satisfy', {
        fullTitle: 'suite test1',
        err: {
          message: /done\(\) called multiple times in test <suite test1> of file.+multiple-done-specs\.fixture\.js/,
          code: MULTIPLE_DONE
        }
      });
    });
  });

  describe('from a before hook', function() {
    before(function(done) {
      runMochaJSON('multiple-done-before', function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in failure', function() {
      expect(res, 'to have failed test count', 1)
        .and('to have passed test count', 1)
        .and('to have pending test count', 0)
        .and('to have failed');
    });

    it('correctly attributes the error', function() {
      expect(res.failures[0], 'to satisfy', {
        fullTitle: 'suite "before all" hook in "suite"',
        err: {
          message: /done\(\) called multiple times in hook <suite "before all" hook> of file.+multiple-done-before\.fixture\.js/
        }
      });
    });
  });

  describe('from a "before each" hook', function() {
    before(function(done) {
      runMochaJSON('multiple-done-before-each', function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in a failure', function() {
      expect(res, 'to have failed test count', 2)
        .and('to have passed test count', 2)
        .and('to have pending test count', 0)
        .and('to have exit code', 2);
    });

    it('correctly attributes the errors', function() {
      expect(res.failures, 'to satisfy', [
        {
          fullTitle: 'suite "before each" hook in "suite"',
          err: {
            message: /done\(\) called multiple times in hook <suite "before each" hook> of file.+multiple-done-before-each\.fixture\.js/
          }
        },
        {
          fullTitle: 'suite "before each" hook in "suite"',
          err: {
            message: /done\(\) called multiple times in hook <suite "before each" hook> of file.+multiple-done-before-each\.fixture\.js/
          }
        }
      ]);
    });
  });

  describe('when done() called asynchronously', function() {
    before(function(done) {
      // we can't be sure that mocha won't fail with an uncaught exception here, which would cause any JSON
      // output to be befouled; we need to run "raw" and capture STDERR
      invokeMocha(
        require.resolve('./fixtures/multiple-done-async.fixture.js'),
        function(err, result) {
          res = result;
          done(err);
        },
        'pipe'
      );
    });

    it('results in error', function() {
      expect(res, 'to satisfy', {
        code: expect.it('to be greater than', 0),
        output: /done\(\) called multiple times in test <should fail in an async test case> \(of root suite\) of file.+multiple-done-async\.fixture\.js/
      });
    });
  });
});
