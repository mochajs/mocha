'use strict';

var assert = require('assert');
var delay = 200;

setTimeout(function () {
  describe('delayed execution', function () {
    it('should have no effect if attempted twice in the same suite', function () {
      assert(true);
      run();
      assert(true);
    });
  });

  run();
}, delay);
