'use strict';

var assert = require('assert');
var run = require('./helpers').runMochaJSON;
var fork = require('child_process').fork;
var path = require('path');
var args = [];

describe('this.timeout()', function () {
  it('is respected by sync and async suites', function (done) {
    run('timeout.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 0);
      assert.equal(res.stats.failures, 2);
      assert.equal(res.code, 2);
      done();
    });
  });

  describe('0 (no timeout)', function () {
    this.timeout(10 * 1000);

    it('does not spuriously end async tests that miss calling `done`', function (done) {
      var child = fork(path.join(__dirname, '..', '..', 'bin', '_mocha'), [path.join(__dirname, 'fixtures', 'timeout-0-done.fixture.js')], { silent: true });
      child.on('error', function (error) {
        if (timeout) { clearTimeout(timeout); }
        if (done) { done(error); }
        done = null;
      });
      var timeout;
      child.on('message', function () {
        timeout = setTimeout(function () {
          child.kill('SIGINT');
          if (done) { done(); }
          done = null;
        }, 5000);
      });
      child.on('exit', fail);
      child.on('close', fail);
      function fail () {
        clearTimeout(timeout);
        if (done) { done(new Error('Test ended despite disabled timeout!')); }
        done = null;
      }
    });

    it('does not spuriously end promise tests that never resolve', function (done) {
      var child = fork(path.join(__dirname, '..', '..', 'bin', '_mocha'), [path.join(__dirname, 'fixtures', 'timeout-0-promise.fixture.js')], { silent: true });
      child.on('error', function (error) {
        if (timeout) { clearTimeout(timeout); }
        if (done) { done(error); }
        done = null;
      });
      var timeout;
      child.on('message', function () {
        timeout = setTimeout(function () {
          child.kill('SIGINT');
          if (done) { done(); }
          done = null;
        }, 5000);
      });
      child.on('exit', fail);
      child.on('close', fail);
      function fail () {
        clearTimeout(timeout);
        if (done) { done(new Error('Test ended despite disabled timeout!')); }
        done = null;
      }
    });
  });
});
