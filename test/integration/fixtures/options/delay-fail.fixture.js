'use strict';

setTimeout(function () {
  throw new Error('oops');
  /* eslint no-unreachable: off */
  it('test', function () {});
  run();
}, 100);
