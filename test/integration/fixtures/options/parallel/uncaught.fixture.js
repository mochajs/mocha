'use strict';

it('throws an uncaught exception', function (done) {
  process.nextTick(function () {
    throw new Error('existential isolation!!');
  });
});
