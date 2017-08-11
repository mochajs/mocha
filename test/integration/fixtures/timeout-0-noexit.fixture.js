'use strict';

describe('all test possibilities', function () {
  it('finishes', function () {
    process.send('process started');
  });

  it('finishes asynchronously', function (done) {
    setTimeout(done, 0);
  });

  it('finishes with a promise', function () {
    return Promise.resolve();
  });

  it('errors synchronously', function () {
    throw new Error('ignore me');
  });

  it('errors synchronously for an async test', function (done) {
    throw new Error('ignore me');
  });

  it('returns a rejected promise', function () {
    return Promise.reject(new Error('ignore me'));
  });

  it('errors asynchronously', function (done) {
    setTimeout(function () { throw new Error('ignore me'); }, 10);
  });

  it('fails (with done) asynchronously', function (done) {
    setTimeout(done.bind(null, new Error('ignore me')), 10);
  });

  it('returns a promise that eventually rejects', function () {
    return new Promise(function (resolve, reject) { setTimeout(reject.bind(null, new Error('ignore me')), 10); });
  });
});
