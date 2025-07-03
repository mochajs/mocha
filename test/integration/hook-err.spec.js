'use strict';
const {
  runMocha,
  runMochaJSON,
  runMochaJSONAsync,
  SPLIT_DOT_REPORTER_REGEXP
} = require('./helpers');
const {bang} = require('../../lib/reporters/base').symbols;

describe('hook error handling', function () {
  let lines;

  describe('before hook error', function () {
    before(run('hooks/before-hook-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['before', bang + 'test 3']);
    });
  });

  describe('before hook error tip', function () {
    before(run('hooks/before-hook-error-tip.fixture.js', onlyErrorTitle()));
    it('should verify results', function () {
      expect(lines, 'to equal', [
        '1) spec 2',
        '"before all" hook for "skipped":'
      ]);
    });
  });

  describe('before hook root error', function () {
    it('should verify results', function (done) {
      runMochaJSON('hooks/before-hook-root-error', [], (err, res) => {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', 'before hook root error')
          .and('to have failed test', '"before all" hook in "{root}"')
          .and('to have passed test count', 0);
        done();
      });
    });
  });

  describe('before hook nested error', function () {
    it('should verify results', function (done) {
      runMochaJSON('hooks/before-hook-nested-error', [], (err, res) => {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', 'before hook nested error')
          .and(
            'to have failed test',
            '"before all" hook for "it nested - this title should be used"'
          )
          .and('to have passed test count', 1)
          .and('to have passed test', 'should pass');
        done();
      });
    });
  });

  describe('before hook deepnested error', function () {
    it('should verify results', function (done) {
      runMochaJSON('hooks/before-hook-deepnested-error', [], (err, res) => {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', 'before hook nested error')
          .and(
            'to have failed test',
            '"before all" hook in "spec 2 nested - this title should be used"'
          )
          .and('to have passed test count', 1)
          .and('to have passed test', 'should pass');
        done();
      });
    });
  });

  describe('before each hook error', function () {
    before(run('hooks/before-each-hook-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['before', bang + 'test 3']);
    });
  });

  describe('after hook error', function () {
    before(run('hooks/after-hook-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['test 1', 'test 2', 'after', bang + 'test 3']);
    });
  });

  describe('after hook nested error', function () {
    it('should verify results', function (done) {
      runMochaJSON('hooks/after-hook-nested-error', [], (err, res) => {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', 'after hook nested error')
          .and(
            'to have failed test',
            '"after all" hook for "it nested - this title should be used"'
          )
          .and('to have passed test count', 3)
          .and(
            'to have passed test order',
            'should pass',
            'it nested - this title should be used',
            'it nested - not this title'
          );
        done();
      });
    });
  });

  describe('after hook deepnested error', function () {
    it('should verify results', function (done) {
      runMochaJSON('hooks/after-hook-deepnested-error', [], (err, res) => {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', 'after hook nested error')
          .and(
            'to have failed test',
            '"after all" hook in "spec 2 nested - this title should be used"'
          )
          .and('to have passed test count', 2)
          .and(
            'to have passed test order',
            'should pass',
            'it nested - this title should not be used'
          );
        done();
      });
    });
  });

  describe('after each hook error', function () {
    before(run('hooks/after-each-hook-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['test 1', 'after', bang + 'test 3']);
    });
  });

  describe('multiple hook errors', function () {
    before(run('hooks/multiple-hook-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', [
        'root before',
        '1-1 before',
        'root before each',
        '1 before each',
        '1-1 before each',
        bang + '1-1 after each',
        '1 after each',
        'root after each',
        '1-1 after',
        bang + '1-2 before',
        'root before each',
        '1 before each',
        '1-2 before each',
        '1-2 test 1',
        '1-2 after each',
        bang + '1 after each',
        'root after each',
        '1-2 after',
        '1 after',
        '2-1 before',
        'root before each',
        '2 before each',
        bang + '2 after each',
        bang + 'root after each',
        '2-1 after',
        '2 after',
        'root after'
      ]);
    });
  });

  describe('async - before hook error', function () {
    before(run('hooks/before-hook-async-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['before', bang + 'test 3']);
    });
  });

  describe('async - before hook error tip', function () {
    before(
      run('hooks/before-hook-async-error-tip.fixture.js', onlyErrorTitle())
    );
    it('should verify results', function () {
      expect(lines, 'to equal', [
        '1) spec 2',
        '"before all" hook for "skipped":'
      ]);
    });
  });

  describe('async - before each hook error', function () {
    before(run('hooks/before-each-hook-async-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['before', bang + 'test 3']);
    });
  });

  describe('async - after hook error', function () {
    before(run('hooks/after-hook-async-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['test 1', 'test 2', 'after', bang + 'test 3']);
    });
  });

  describe('async - after each hook error', function () {
    before(run('hooks/after-each-hook-async-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', ['test 1', 'after', bang + 'test 3']);
    });
  });

  describe('async - multiple hook errors', function () {
    before(run('hooks/multiple-hook-async-error.fixture.js'));
    it('should verify results', function () {
      expect(lines, 'to equal', [
        'root before',
        '1-1 before',
        'root before each',
        '1 before each',
        '1-1 before each',
        bang + '1-1 after each',
        '1 after each',
        'root after each',
        '1-1 after',
        bang + '1-2 before',
        'root before each',
        '1 before each',
        '1-2 before each',
        '1-2 test 1',
        '1-2 after each',
        bang + '1 after each',
        'root after each',
        '1-2 after',
        '1 after',
        '2-1 before',
        'root before each',
        '2 before each',
        bang + '2 after each',
        bang + 'root after each',
        '2-1 after',
        '2 after',
        'root after'
      ]);
    });
  });

  describe('"this.test.error()-style failure', function () {
    it('should fail the associated test', async function () {
      return expect(
        runMochaJSONAsync('hooks/after-each-this-test-error'),
        'when fulfilled',
        'to have failed'
      ).and(
        'when fulfilled',
        'to have failed test',
        'fail the test from the "after each" hook should fail'
      );
    });
  });

  function run(fnPath, outputFilter) {
    return done =>
      runMocha(fnPath, ['--reporter', 'dot'], (err, res) => {
        expect(err, 'to be falsy');

        lines = res.output
          .split(SPLIT_DOT_REPORTER_REGEXP)
          .map(line => line.trim())
          .filter(outputFilter || onlyConsoleOutput());

        done();
      });
  }
});

function onlyConsoleOutput() {
  let foundSummary = false;
  return line => {
    if (!foundSummary) {
      foundSummary = !!/\(\d+ms\)/.exec(line);
    }
    return !foundSummary && line.length > 0;
  };
}

function onlyErrorTitle() {
  let foundErrorTitle = false;
  let foundError = false;
  return line => {
    if (!foundErrorTitle) {
      foundErrorTitle = !!/^1\)/.exec(line);
    }
    if (!foundError) {
      foundError = /Error:/.exec(line);
    }
    return foundErrorTitle && !foundError;
  };
}
