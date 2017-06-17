'use strict';

var assert = require('assert');
var run = require('./helpers').runMocha;
var args = [];

describe('suite w/no callback', function () {
  this.timeout(2000);
  it('should throw a helpful error message when a callback for suite is not supplied', function (done) {
    run('suite/suite-no-callback.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      var result = res.output.match(/no callback was supplied/) || [];
      assert.equal(result.length, 1);
      done();
    });
  });
});

describe('skipped suite w/no callback', function () {
  this.timeout(2000);
  it('should not throw an error when a callback for skipped suite is not supplied', function (done) {
    run('suite/suite-skipped-no-callback.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      var pattern = new RegExp('Error', 'g');
      var result = res.output.match(pattern) || [];
      assert.equal(result.length, 0);
      done();
    });
  });
});

describe('skipped suite w/ callback', function () {
  this.timeout(2000);
  it('should not throw an error when a callback for skipped suite is supplied', function (done) {
    run('suite/suite-skipped-callback.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      var pattern = new RegExp('Error', 'g');
      var result = res.output.match(pattern) || [];
      assert.equal(result.length, 0);
      done();
    });
  });
});
