'use strict';

describe('pending shorthand', function () {
  xit('pending spec', function () {}).timeout(0);
  xspecify('pending spec', function () {}).timeout(0);
  it.skip('pending spec', function () {}).timeout(0);
});
