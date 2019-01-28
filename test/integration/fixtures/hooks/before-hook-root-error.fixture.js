'use strict';

before(function() {
  throw new Error('before hook root error');
});

describe('spec 1', function () {
  it('should not be called', function () { });
});
