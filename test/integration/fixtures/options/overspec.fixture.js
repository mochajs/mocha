'use strict';

describe('overspecified asynchronous resolution method', function() {
  it('should not fail when multiple methods are used', function(done) {

    setTimeout(done, 0);

    return {
      then: function() {
        throw Error('This should never be called. handled with done()');
      }
    };
  });
});
