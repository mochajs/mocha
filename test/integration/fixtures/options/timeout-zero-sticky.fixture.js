'use strict';

describe('inner suite overrides', function () {
  this.timeout(50);
  it('should NOT time out when --timeout 0 was set globally', function (done) {
    setTimeout(done, 200);
  });
});
