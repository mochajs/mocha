'use strict';

var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

var FIXTURE = 'options/grep';

describe('--grep', function() {
  it('should run specs matching a string', function(done) {
    runMochaJSON(FIXTURE, ['--grep', 'match'], function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('not to have pending tests');
      done();
    });
  });

  describe('should run specs matching a RegExp', function() {
    it('with RegExp-like strings (pattern followed by flag)', function(done) {
      runMochaJSON(FIXTURE, ['--grep', '/match/i'], function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 4)
          .and('not to have pending tests');
        done();
      });
    });

    it('with string as pattern', function(done) {
      runMochaJSON(FIXTURE, ['--grep', '.*'], function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed')
          .and('to have passed test count', 4)
          .and('to have failed test count', 1)
          .and('not to have pending tests');
        done();
      });
    });
  });

  describe('when used with --invert', function() {
    it('should run specs that do not match the pattern', function(done) {
      runMochaJSON(FIXTURE, ['--grep', 'fail', '--invert'], function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 4)
          .and('not to have pending tests');
        done();
      });
    });
  });

  describe('when both --fgrep and --grep used together', function() {
    it('should report an error', function(done) {
      runMocha(
        FIXTURE,
        ['--fgrep', 'first', '--grep', 'second'],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', /mutually exclusive/i);
          done();
        },
        'pipe'
      );
    });
  });
});
