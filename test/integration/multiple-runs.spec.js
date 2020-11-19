'use strict';

const {invokeNode} = require('./helpers');

describe('multiple runs', function() {
  it('should be allowed to run multiple times if cleanReferences is turned off', function(done) {
    var path = require.resolve(
      './fixtures/multiple-runs/run-thrice.fixture.js'
    );
    invokeNode([path], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res.code, 'to be', 0);
      var results = JSON.parse(res.output);
      expect(results, 'to have length', 3);
      expect(results[0].pending, 'to have length', 1);
      expect(results[0].failures, 'to have length', 0);
      expect(results[0].passes, 'to have length', 0);
      expect(results[1].pending, 'to have length', 0);
      expect(results[1].failures, 'to have length', 1);
      expect(results[1].passes, 'to have length', 0);
      expect(results[2].pending, 'to have length', 0);
      expect(results[2].failures, 'to have length', 0);
      expect(results[2].passes, 'to have length', 1);
      done();
    });
  });

  it('should not be allowed if cleanReferences is true', function(done) {
    var path = require.resolve(
      './fixtures/multiple-runs/clean-references.fixture.js'
    );
    invokeNode(
      [path],
      function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed').and(
          'to contain output',
          /ERR_MOCHA_INSTANCE_ALREADY_DISPOSED/
        );

        done();
      },
      {stdio: ['ignore', 'pipe', 'pipe']}
    );
  });

  it('should not be allowed if the instance is disposed', function(done) {
    var path = require.resolve('./fixtures/multiple-runs/dispose.fixture.js');
    invokeNode(
      [path, '--directly-dispose'],
      function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res.code, 'not to be', 0);
        expect(res.output, 'to contain', 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED');
        done();
      },
      {stdio: ['ignore', 'pipe', 'pipe']}
    );
  });

  it('should not be allowed to run while a previous run is in progress', function(done) {
    var path = require.resolve(
      './fixtures/multiple-runs/start-second-run-if-previous-is-still-running.fixture'
    );
    invokeNode(
      [path],
      function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res.output, 'to contain', 'ERR_MOCHA_INSTANCE_ALREADY_RUNNING');
        done();
      },
      {stdio: ['ignore', 'pipe', 'pipe']}
    );
  });

  it('should reset the hooks between runs', function(done) {
    var path = require.resolve(
      './fixtures/multiple-runs/multiple-runs-with-flaky-before-each.fixture'
    );
    invokeNode([path], function(err, res) {
      expect(err, 'to be null');
      expect(res.code, 'to be', 0);
      var results = JSON.parse(res.output);
      expect(results, 'to have length', 2);
      expect(results[0].failures, 'to have length', 1);
      expect(results[0].passes, 'to have length', 0);
      expect(results[1].passes, 'to have length', 1);
      expect(results[1].failures, 'to have length', 0);
      done();
    });
  });
});
