'use strict';

describe('timeout override', function() {
  it('should fail async test due to re-enable', function(done) {
    this.timeout(0);
    this.timeout(1);
    setTimeout(done, 2);
  });
});
