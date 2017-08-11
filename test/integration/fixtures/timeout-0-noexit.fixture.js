'use strict';

it('finishes', function () {
  process.send('process started');
  this.timeout(0);
});

it('finishes asynchronously', function (done) {
  this.timeout(0);
  setTimeout(done, 0);
});

it('finishes with a promise', function () {
  this.timeout(0);
  return Promise.resolve();
});
