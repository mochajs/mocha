'use strict';

var run = require('./helpers').runMocha;
var assert = require('assert');

describe('esModules', function () {
  describe('loading of es module tests', function () {
    this.timeout(1000);
    it('should load tests which use named exports', function (done) {
      run('es-modules/named-export.fixture.mjs', ['--es-modules', '--experimental-modules', '--harmony-dynamic-import'], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.pending, 0);
        assert.equal(res.passing, 1);
        assert.equal(res.failing, 0);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('should load tests which use default exports', function (done) {
      this.timeout(1000);
      run('es-modules/default-export.fixture.mjs', ['--es-modules', '--experimental-modules', '--harmony-dynamic-import'], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.pending, 0);
        assert.equal(res.passing, 1);
        assert.equal(res.failing, 0);
        assert.equal(res.code, 0);
        done();
      });
    });
  });
});
