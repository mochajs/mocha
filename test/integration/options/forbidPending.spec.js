'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

describe('--forbid-pending', function () {
  var args = [];
  var pendingErrorMessage = 'Pending test forbidden';

  before(function () {
    args = ['--forbid-pending'];
  });

  it('should succeed if there are only passed tests', function (done) {
    var fixture = path.join('options', 'forbid-pending', 'passed');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  it('should fail if there are tests in suites marked skip', function (done) {
    var fixture = path.join('options', 'forbid-pending', 'skip-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to satisfy', {
          code: 1,
          output: new RegExp(pendingErrorMessage)
        });
        done();
      },
      spawnOpts
    );
  });

  it('should fail if there is empty suite marked pending', function (done) {
    var fixture = path.join('options', 'forbid-pending', 'skip-empty-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to satisfy', {
          code: 1,
          output: new RegExp(pendingErrorMessage)
        });
        done();
      },
      spawnOpts
    );
  });

  var forbidPendingFailureTests = {
    'should fail if there are tests marked skip': 'skip',
    'should fail if there are pending tests': 'pending',
    'should fail if tests call `skip()`': 'this-skip',
    'should fail if beforeEach calls `skip()`': 'beforeEach-this-skip',
    'should fail if before calls `skip()`': 'before-this-skip'
  };

  Object.keys(forbidPendingFailureTests).forEach(function (title) {
    it(title, function (done) {
      var fixture = path.join(
        'options',
        'forbid-pending',
        forbidPendingFailureTests[title]
      );
      runMochaJSON(fixture, args, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with error', pendingErrorMessage);
        done();
      });
    });
  });
});
