'use strict';

var run = require('./helpers').runMocha;
var runJSON = require('./helpers').runMochaJSON;

describe('regressions', function() {
  it('issue-1327: should run the first test and then bail', function(done) {
    var args = [];
    runJSON('regression/issue-1327.fixture.js', args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have failed')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1)
        .and('to have passed test', 'test 1')
        .and('to have failed test', 'test 1');
      done();
    });
  });

  it('issue-1991: Declarations do not get cleaned up unless you set them to `null` - Memory Leak', function(done) {
    // on a modern MBP takes ±5 seconds on node 4.0, but on older laptops with node 0.12 ±40 seconds.
    // Could easily take longer on even weaker machines (Travis-CI containers for example).
    this.timeout(120000);
    this.slow(12000);
    run('regression/issue-1991.fixture.js', [], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'not to contain output', 'process out of memory').and(
        'to have passed'
      );
      done();
    });
  });

  describe("issue-2286: after doesn't execute if test was skipped in beforeEach", function() {
    var afterWasRun = false;
    describe('suite with skipped test for meta test', function() {
      beforeEach(function() {
        this.skip();
      });
      after(function() {
        afterWasRun = true;
      });
      it('should be pending', function() {});
    });
    after('meta test', function() {
      expect(afterWasRun, 'to be', true);
    });
  });

  it('issue-2315: cannot read property currentRetry of undefined', function(done) {
    runJSON('regression/issue-2315.fixture.js', [], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have failed')
        .and('not to have pending tests')
        .and('to have failed test count', 1);
      done();
    });
  });

  it('issue-2406: should run nested describe.only suites', function(done) {
    runJSON('regression/issue-2406.fixture.js', [], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have passed')
        .and('not to have pending tests')
        .and('to have passed test count', 2);
      done();
    });
  });

  it('issue-2417: should not recurse infinitely with .only suites nested within each other', function(done) {
    runJSON('regression/issue-2417.fixture.js', [], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have passed')
        .and('not to have pending tests')
        .and('to have passed test count', 1);
      done();
    });
  });

  it('issue-1417 uncaught exceptions from async specs', function(done) {
    runJSON('regression/issue-1417.fixture.js', [], function(err, res) {
      if (err) {
        done(err);
        return;
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
});
