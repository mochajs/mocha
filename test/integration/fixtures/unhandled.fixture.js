'use strict';

function rejectWith(err) {
  return new Promise(function (resolve, reject) {
    reject(err);
  });
}

// We wish to test unhandled rejections, which happen after a tick at the
// earliest, so we need a way some way to signal mocha our tests are async. One
// way is to accept the `done` parameter without ever using it. Another is
// returning a promise which never resolves. Since this tests promise handling,
// why don't we go all the way with the promises?
var unresolvedPromise = new Promise(function () {});

it('fails when faced with an unhandled rejection', function () {
  rejectWith(new Error('rejection'));

  return unresolvedPromise;
});

it('fails exactly once when a global promise is rejected first', function () {
  setTimeout(function () {
    rejectWith(new Error('global error'));
  }, 0);

  return unresolvedPromise;
});

it('fails exactly once when a global promise is rejected second', function () {
  setTimeout(function () {
    rejectWith(new Error('test error'));
  }, 0);

  setTimeout(function () {
    rejectWith(new Error('global error'));
  }, 0);

  return unresolvedPromise;
});
