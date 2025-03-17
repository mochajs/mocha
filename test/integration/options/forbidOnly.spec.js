'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

describe('--forbid-only', function () {
  var args = [];
  var onlyErrorMessage = '`.only` forbidden';

  beforeEach(function () {
    args = ['--forbid-only'];
  });

  it('should succeed if there are only passed tests', function (done) {
    var fixture = path.join('options', 'forbid-only', 'passed');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  it('should fail if there are tests marked only', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail if there are tests in suites marked only', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail if there is empty suite marked only', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-empty-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail if there is suite marked only which matches grep', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args.concat('--fgrep', 'suite marked with only'),
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail if suite marked only does not match grep', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args.concat('--fgrep', 'bumble bees'),
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail if suite marked only does not match inverted grep', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-suite');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args.concat('--fgrep', 'suite marked with only', '--invert'),
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail even if before has "skip"', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-before');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });

  it('should fail even if beforeEach has "skip"', function (done) {
    var fixture = path.join('options', 'forbid-only', 'only-before-each');
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixture,
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', new RegExp(onlyErrorMessage));
        done();
      },
      spawnOpts
    );
  });
});
