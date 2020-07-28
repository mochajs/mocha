'use strict';

describe('suite1', function () {
  before(function (done) {
    setTimeout(done, 10);
    setTimeout(done, 30);
  });

  it('test1', function (done) {
    setTimeout(done, 50);
  });
});
