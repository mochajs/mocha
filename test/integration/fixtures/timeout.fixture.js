'use strict';

describe('timeout', function () {
  this.timeout(1);

  it('should be honored with sync suites', function () {
    sleep(2);
  });

  it('should be honored with async suites', function (done) {
    sleep(2);
    done();
  });

  function sleep (ms) {
    var start = Date.now();
    while (start + ms > Date.now());
  }
});
