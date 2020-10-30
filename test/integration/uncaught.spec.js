'use strict';

const {
  runMocha,
  runMochaJSON: run,
  invokeMochaAsync,
  invokeNode,
  resolveFixturePath
} = require('./helpers');
var args = [];

describe('uncaught exceptions', function() {
  it('handles uncaught exceptions from hooks', function(done) {
    run('uncaught/hook', args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed with error', 'oh noes')
        .and('to have passed test count', 0)
        .and('to have pending test count', 0)
        .and('to have failed test count', 1)
        .and('to have failed test', '"before each" hook for "test"');

      done();
    });
  });

  it('handles uncaught exceptions from async specs', function(done) {
    run('uncaught/double', args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed with error', 'global error', 'test error')
        .and('to have passed test count', 0)
        .and('to have pending test count', 0)
        .and('to have failed test count', 2)
        .and(
          'to have failed test',
          'fails exactly once when a global error is thrown first',
          'fails exactly once when a global error is thrown second'
        );

      done();
    });
  });

  it('handles uncaught exceptions from which Mocha cannot recover', function(done) {
    run('uncaught/fatal', args, function(err, res) {
      if (err) {
        return done(err);
      }

      var testName = 'should bail if a successful test asynchronously fails';
      expect(res, 'to have failed with error', 'global error')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1)
        .and('to have passed test', testName)
        .and('to have failed test', testName);

      done();
    });
  });

  it('handles uncaught exceptions within pending tests', function(done) {
    run('uncaught/pending', args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed with error', 'I am uncaught!')
        .and('to have passed test count', 3)
        .and('to have pending test count', 1)
        .and('to have failed test count', 1)
        .and(
          'to have passed test',
          'test1',
          'test3 - should run',
          'test4 - should run'
        )
        .and('to have pending test order', 'test2')
        .and('to have failed test', 'test2');

      done();
    });
  });

  it('handles uncaught exceptions within open tests', function(done) {
    run('uncaught/recover', args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(
        res,
        'to have failed with error',
        'Whoops!',
        'Whoops!', // JSON reporter does not show the second error message
        'should get upto here and throw'
      )
        .and('to have passed test count', 2)
        .and('to have failed test count', 3)
        .and('to have passed test', 'should wait 15ms', 'test 3')
        .and(
          'to have failed test',
          'throw delayed error',
          'throw delayed error',
          '"after all" hook for "test 3"'
        );

      done();
    });
  });

  it('removes uncaught exceptions handlers correctly', function(done) {
    invokeNode([resolveFixturePath('uncaught/listeners')], function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed');
      done();
    });
  });

  it("handles uncaught exceptions after runner's end", function(done) {
    runMocha(
      'uncaught/after-runner',
      args,
      function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res, 'to have failed').and('to satisfy', {
          failing: 0,
          passing: 1,
          pending: 0,
          output: expect.it('to contain', 'Error: Unexpected crash')
        });

        done();
      },
      'pipe'
    );
  });

  it('issue-1327: should run the first test and then bail', function(done) {
    run('uncaught/issue-1327', args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have failed with error', 'Too bad')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1)
        .and('to have passed test', 'test 1')
        .and('to have failed test', 'test 1');
      done();
    });
  });

  it('issue-1417: uncaught exceptions from async specs', function(done) {
    run('uncaught/issue-1417', args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have failed with errors', 'sync error a', 'sync error b')
        .and('to have exit code', 2)
        .and('not to have passed tests')
        .and('not to have pending tests')
        .and('to have failed test order', [
          'fails exactly once when a global error is thrown synchronously and done errors',
          'fails exactly once when a global error is thrown synchronously and done completes'
        ]);
      done();
    });
  });

  describe('issue-4481: behavior of non-Mocha-originating unhandled rejections', function() {
    describe('when Node is in "warn" mode', function() {
      it('should warn', async function() {
        const [, promise] = invokeMochaAsync(
          [
            resolveFixturePath('uncaught/unhandled'),
            '--unhandled-rejections=warn'
          ],
          {stdio: 'pipe'}
        );

        return expect(
          promise,
          'when fulfilled',
          'to have passed with output',
          /UnhandledPromiseRejectionWarning: Error: yikes/
        );
      });
    });

    describe('when Node is in "strict" mode', function() {
      it('should fail with an uncaught exception', async function() {
        const [, promise] = invokeMochaAsync(
          [
            resolveFixturePath('uncaught/unhandled'),
            '--unhandled-rejections=strict'
          ],
          {stdio: 'pipe'}
        );
        return expect(
          promise,
          'when fulfilled',
          'to have failed with output',
          /Error: yikes/
        );
      });
    });
  });
});
