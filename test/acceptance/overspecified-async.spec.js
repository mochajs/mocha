'use strict';

describe('overspecified asynchronous resolution method', function () {
  it('should fail when multiple methods are used', function (done) {
    setTimeout(done, 0);

    // uncomment
    // return { then: function() {} };
  });
});
