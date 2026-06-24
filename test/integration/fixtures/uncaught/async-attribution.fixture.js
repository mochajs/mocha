'use strict';

describe('async error attribution', function () {
  it('passes but schedules a late failure', function () {
    setTimeout(function () {
      throw new Error('late boom');
    }, 50);
  });

  it('unrelated test 1', function (done) {
    setTimeout(done, 150);
  });

  it('unrelated test 2', function (done) {
    setTimeout(done, 50);
  });
});
