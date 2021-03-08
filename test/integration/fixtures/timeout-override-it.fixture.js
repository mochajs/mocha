'use strict';

describe('timeout override', function() {
  it('should allow using it().timeout()', function(done) {
    setTimeout(done, 1);
  }).timeout(1000);
});
