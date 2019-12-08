'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

describe('--forbid-empty-suite', function() {
  var args = [];
  var emptySuiteErrorMessage = 'Empty suite forbidden';

  before(function() {
    args = ['--forbid-empty-suite'];
  });

  it('should succeed if there are tests', function(done) {
    var fixture = path.join('options', 'forbid-empty-suite', 'passed');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  it('should succeed if there is an inner suite with tests', function(done) {
    var fixture = path.join('options', 'forbid-empty-suite', 'nested-suite');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  it('should succeed if there are dynamically added tests', function(done) {
    var fixture = path.join(
      'options',
      'forbid-empty-suite',
      'dynamically-added-test'
    );
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  var forbidEmptySuiteFailureTests = {
    'should fail if there are no test suites': 'empty',
    'should fail if there are no tests': 'empty-suite',
    'should fail if there is an inner suite with no tests': 'empty-nested-suite'
  };

  Object.keys(forbidEmptySuiteFailureTests).forEach(function(title) {
    it(title, function(done) {
      var fixture = path.join(
        'options',
        'forbid-empty-suite',
        forbidEmptySuiteFailureTests[title]
      );
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        args,
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(emptySuiteErrorMessage)
          });
          done();
        },
        spawnOpts
      );
    });
  });
});
