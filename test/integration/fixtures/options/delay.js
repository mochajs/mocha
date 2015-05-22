var assert = require('assert');
var delay  = 500;
var start  = new Date().getTime();

setTimeout(function() {
  describe('delayed execution', function() {
    it('should have waited ' + delay + 'ms to run this suite', function() {
      assert(new Date().getTime() - delay >= start);
    });

    it('should have no effect if attempted twice in the same suite', function() {
      assert(true);
      run();
      assert(true);
    });
  });

  run();
}, delay);
