'use strict';

it('never finishes', function () {
  this.timeout(0);
  return new Promise(function () {});
});
