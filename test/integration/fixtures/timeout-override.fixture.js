'use strict';

describe('timeout override', function() {
  it('should fail async test due to re-enable', function(done) {
    this.enableTimeouts(false);
    this.timeout(1);
    setTimeout(done, 2);
  });
});
