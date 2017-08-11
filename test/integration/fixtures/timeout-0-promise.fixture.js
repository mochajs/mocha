'use strict';

it('never finishes', function () {
  process.send('process started');
  this.timeout(0);
  return new Promise(function () {});
});
