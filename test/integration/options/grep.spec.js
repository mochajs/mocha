'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

describe('--grep', function() {
  var args = [];
  var fixture = path.join('options', 'grep');

  afterEach(function() {
    args = [];
  });

  it('should run specs matching a string', function(done) {
    args = ['--grep', 'match'];
    runMochaJSON(fixture, args, function(err, res) {
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
    it('with RegExp-like strings (pattern follow by flag)', function(done) {
      args = ['--grep', '/match/i'];
      runMochaJSON(fixture, args, function(err, res) {
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
      args = ['--grep', '.*'];
      runMochaJSON(fixture, args, function(err, res) {
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

  describe('when --invert used', function() {
    it('should run specs that do not match the pattern', function(done) {
      args = ['--grep', 'fail', '--invert'];
      runMochaJSON(fixture, args, function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 4)
          .and('not to have pending tests');
        done();
      });
    });

    it('should throw an error when option used in isolation', function(done) {
      var spawnOpts = {stdio: 'pipe'};
      args = ['--invert'];
      runMocha(
        fixture,
        args,
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: /--invert.*--grep <regexp>/
          });
          done();
        },
        spawnOpts
      );
    });
  });

  describe('when both --fgrep and --grep used together', function() {
    it('should conflict', function(done) {
      // var fixture = 'uncaught.fixture.js';
      args = ['--fgrep', 'first', '--grep', 'second'];

      runMocha(fixture, args, function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed');
        done();
      });
    });
  });
});
