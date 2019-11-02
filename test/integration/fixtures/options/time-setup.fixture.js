'use strict';

describe('time-setup', function () {
  beforeEach(function(done) {
    // simulate some slow setup process
    setTimeout(done, 20);
  });

  it('should run quickly', function () {});
});
