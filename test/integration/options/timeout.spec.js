'use strict';

var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--timeout', function() {
  it('should allow human-readable string value', function(done) {
    runMochaJSON('options/slow-test', ['--timeout', '1s'], function(err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have failed')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1);
      done();
    });
  });

  it('should allow numeric value', function(done) {
    runMochaJSON('options/slow-test', ['--timeout', '1000'], function(
      err,
      res
    ) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have failed')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1);
      done();
    });
  });

  it('should allow multiple values', function(done) {
    var fixture = 'options/slow-test';
    runMochaJSON(fixture, ['--timeout', '2s', '--timeout', '1000'], function(
      err,
      res
    ) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have failed')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1);
      done();
    });
  });
});
