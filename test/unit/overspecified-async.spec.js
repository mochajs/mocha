'use strict';

describe('overspecified asynchronous resolution method', function() {
  it('should fail when multiple methods are used', function(done) {
    setTimeout(done, 0);

    // uncomment
    // return {
    //   then: function() {}
    // };
  });
});

describe('overspecified asynchronous resolution method', function() {
  it('should not fail when multiple methods are used', function(done) {
    setTimeout(done, 0);

    this.overspec(true);

    return {
      then: function() {
        throw Error('This should never be called. handled with done()');
      }
    };
  });
});
