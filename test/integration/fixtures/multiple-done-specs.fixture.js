'use strict';

describe('suite', function () {
  it('test1', function (done) {
    done();
    setTimeout(done, 10);
  });

  it('test2', function (done) {
    setTimeout(done, 20);
  });
});
