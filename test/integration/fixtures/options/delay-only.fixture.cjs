'use strict';

var assert = require('assert');
var delay = 200;

setTimeout(function () {
  describe('delayed execution should execute exclusive tests only', function () {
    it('should not run this test', function () {
      (true).should.equal(false);
    });

    it.only('should run this', function () {});

    it('should not run this test, neither', function () {
      (true).should.equal(false);
    });

    it.only('should run this, too', function () {});
  });

  run();
}, delay);


