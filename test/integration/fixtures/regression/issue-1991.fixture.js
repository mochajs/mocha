'use strict';

/* eslint no-unused-vars: off */

function MemoryLeak () {
  this.myArr = [];
  for (var i = 0; i < 1000000; i++) {
    this.myArr.push(i);
  }
}

var numOfTests = 300;
for (var i = 0; i < numOfTests; i += 1) {
  /*
   * This Test suite will crash V8 due to:
   * 'FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory'
   * if all the deferred functions references have not been cleared
   */
  describe('Memory Leak Suite #' + i, function () {
    // The <closureVar> variable will be accessed by the test below.
    // As long as those test's functions are
    // referenced in memory, the closure variable may not be garbage collected
    // as it is still referenced.
    // * In a chrome heap snapshot it will appear under "system / Context" (a scope)
    var closureVar;

    before(function () {
      var x = closureVar ? 1 : 2;
    });

    after(function () {
      var x = closureVar[0];
    });

    beforeEach(function () {
      var x = closureVar ? 1 : 2;
    });

    afterEach(function () {
      var x = closureVar[0];
    });

    it('access a variable via a closure', function () {
      // slow performance on older node.js versions
      this.timeout(1000);
      closureVar = new MemoryLeak();
    });
  });
}
